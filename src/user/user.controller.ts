import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async getAllUsers(@Res() res: Response) {
    const allUsers = await this.userService.getAllUsers();
    res.status(HttpStatus.OK).json(allUsers);
  }
}
