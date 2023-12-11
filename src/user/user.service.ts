import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/repository/user.entity';
import { Repository } from 'typeorm';
import { HashPassword } from '../common/password-hash/hash.password';
import { plainToInstance } from 'class-transformer';
import { GetAllUsersResponse } from './dto/user-response.dto';
import { LoginDto } from 'src/auth/dto/signUp_signIn.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private hashPassword: HashPassword,
  ) {}

  async findById(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      return user;
    } catch (error) {
      Logger.error('find one function => ', error);
      throw error;
    }
  }

  async findOne(data: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { username: data },
      });
      return user;
    } catch (error) {
      Logger.error('find one function => ', error);
      throw error;
    }
  }

  async createUser(data: LoginDto) {
    const existUser = await this.userRepository.findOne({
      where: { username: data.username },
    });
    if (existUser) {
      throw new BadRequestException('username is exist!');
    }
    const passwordHash = await this.hashPassword.PasswordHash(data.password);
    const user = await this.userRepository.save(
      this.userRepository.create({
        username: data.username,
        password: passwordHash,
      }),
    );
    return user;
  }

  async getAllUsers(): Promise<GetAllUsersResponse[]> {
    // return this.userRepository
    //   .createQueryBuilder('user')
    //   .select(['user.id', 'user.username'])
    //   .getMany();

    //es querybuildery xi es ogtagorcel ste? parz selection a, vereviny greluc nax senc gri, heto senc mi gri, takiny gri

    const users = await this.userRepository.find();
    const getAllUsersResponse = plainToInstance(GetAllUsersResponse, users, {
      enableImplicitConversion: true,
    });
    console.log(getAllUsersResponse);

    return getAllUsersResponse;
  }
}
