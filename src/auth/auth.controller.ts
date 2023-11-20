import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LoginDto, RegisterDto } from './dto/signUp_signIn.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'user sign in, add username and password.',
  })
  @Post('login')
  async login(@Req() req, @Body() body: LoginDto, @Res() res: Response) {
    const token = this.authService.login(body);
    res.status(HttpStatus.ACCEPTED).json(token);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'user sign up, add username and password.',
  })
  @Post('signUp')
  async signUp(@Res() res: Response, @Body() body: RegisterDto) {
    try {
      const result = await this.authService.signUp(body);
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      Logger.error('signUp function error');
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'when logout, token is deleted.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('logout')
  async logout(@Req() req: Request) {
    await this.authService.logout(req.user);
  }
}
