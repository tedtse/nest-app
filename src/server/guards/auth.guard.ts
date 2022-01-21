import {
  forwardRef,
  Inject,
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from '@server/constants';
import { AuthService } from '@server/modules/auth/auth.service';

export const NoAuth = () => SetMetadata('no-auth', true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const request = context.switchToHttp().getRequest();
    const noAuth = this.reflector.get<boolean>('no-auth', context.getHandler());
    if (noAuth) {
      return true;
    }
    const token = context.switchToRpc().getData().headers.token;
    if (!token) {
      throw new UnauthorizedException('token为空');
    }
    let decode: any;
    try {
      decode = jwt.verify(token, jwtConstants.secret);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
    const blackToken = await this.authService.findBlackToken({
      token,
      userId: decode._id,
    });
    if (blackToken) {
      throw new UnauthorizedException('token已失效, 请重新登录');
    }
    return true;
  }
}
