import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUser } from 'src/common/interfaces/jwt-user.interface';
import { JwtRequest } from 'src/common/interfaces/jwt-request.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): JwtUser | undefined => {
    const { user } = context.switchToHttp().getRequest<JwtRequest>();
    return user;
  },
);
