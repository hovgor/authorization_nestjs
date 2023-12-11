import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtUser } from 'src/common/interfaces/jwt-user.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret_key',
      passReqToCallback: true,
    });
  }

  validate(payload: JwtPayload): JwtUser {
    return {
      userId: payload.sub,
    };
  }
}
