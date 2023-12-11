import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RealIp } from 'nestjs-real-ip';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard) //jwt guardi imasty en a vor konkret user konkret iranakan info vercni, es get all usersy animasta, get details gri, auth controlleri mej nayi CurrentUser decoratory vonc em ogtagorcel, u tenc details get ara, es get all usersi imastalic linelu hamar mi hat el usernerid roler piti avelacnes, mi hat el admin guard gres dnes vren qo xerin petq chi
  @Get('all')
  async getAllUsers(@RealIp() ip: string) {

    //return typery gri te stex te servisnerum, return typey piti interface lini, menak mtnoxna dto vor class validator kaxes vren validacia anes
    return this.userService.getAllUsers();
  }
}
