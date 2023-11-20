import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/repository/user.entity';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto/signUp_signIn.dto';
import { client } from 'src/config/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
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

  async signUp(data: RegisterDto) {
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

  async logout(user: any) {
    client.del(`user:${user.id}`);
  }
}
