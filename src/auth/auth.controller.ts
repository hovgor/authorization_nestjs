import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/signUp_signIn.dto';
import { JwtGuard } from './guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/request.decorator';
import { JwtUser } from 'src/common/interfaces/jwt-user.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Authenticate',
  })
  @Post('/')
  async authorize(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Sign up',
  })
  @Post('sign-up')
  async signUp(@Body() dto: LoginDto) {
    return this.authService.signUp(dto);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Log out',
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@CurrentUser() user: JwtUser): Promise<void> {
    return this.authService.logout(user.userId);
  }
}
