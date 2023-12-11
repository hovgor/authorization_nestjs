import { Request } from 'express';
import { JwtUser } from './jwt-user.interface';

export interface JwtRequest extends Request {
  user?: JwtUser;
}
