import {
  Controller,
  Headers,
  Body,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from '@server/filters/http-exception.filter';
import { ResponseInterceptor } from '@server/interceptors/transform-interceptor';
import { AuthService } from './auth.service';

@Controller('api/auth')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(new ResponseInterceptor())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { search, password }) {
    return this.authService.login(search, password);
  }

  @Post('logout')
  async logout(@Headers() { token }) {
    return this.authService.logout(token);
  }
}
