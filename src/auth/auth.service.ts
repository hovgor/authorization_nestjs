import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/repository/user.entity';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/signUp_signIn.dto';
import { client } from 'src/config/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  // esi petq chi, sax imasty tokeny validate aneln a u useri infon mejic vercnely voch te baza zapros anel tenal user ka te che, iranq daje grel ein vor tokeny piti tarber mikroservisnerum ogtagorcen, amen mikroservisi bazayum user chpiti lini
  async validateUser(username: string, password: string) {
    const user: UserEntity = await this.userService.findOne(username);
    if (user && user.password === password) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: LoginDto) {
    const userExist: UserEntity = await this.userService.findOne(user.username);
    if (!userExist) {
      throw new BadRequestException('user not exist.');
    }
    const payload = { username: userExist.username, sub: userExist.id };
    const accessToken: string = this.jwtService.sign(payload);
    client.set(`user:${userExist.id}`, accessToken);
    client.expire(accessToken, 24 * 60 * 60);
    return { access_token: accessToken };
  }
  //sign upi vaxt menak sign up es anum u vsyo Promise<void> a linum return typey, fronty menak 200 piti stana, lav mek el kara inch vor { message: 'Success' } stana, ete tenc anes anpayman type sarqi(interface)
  // token generacneluc zuygov en generacnum, access token u refresh token , refreshy pahum es redisum(), accessy unenuma kyanqi jamket 'exp' kam senc inch vor anun, bayc iranq vonc vor redis en uzel da pahel xuy evo xi, dra hamar nax redisi checkery strategyi mej piti validacnes validate() functioni mej, nor return anes en inch hima grel em kam false, hamapatasxanabar poxelov validate functioni return typey

  async signUp(data: LoginDto) {
    try {
      const user = await this.userService.createUser(data);
      const payload = { username: user.username, sub: user.id };
      const accessToken = this.jwtService.sign(payload);
      client.set(`user:${user.id}`, accessToken);
      client.expire(accessToken, 24 * 60 * 60);
      return { access_token: accessToken };
    } catch (error) {
      Logger.error('sign up function ', error);
      throw error;
    }
  }

  async logout(userId: number) {
    client.del(`user:${userId}`);
  }
}
