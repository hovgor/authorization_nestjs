import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/repository/user.entity';
import { HashPassword } from 'src/common/password-hash/hash.password';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, HashPassword],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
