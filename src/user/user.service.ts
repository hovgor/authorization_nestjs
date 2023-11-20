import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/repository/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { HashPassword } from '../shared/password-hash/hash.password';

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

  async createUser(data: CreateUserDto) {
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

  async getAllUsers() {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.username'])
      .getMany();
    return users;
  }
}
