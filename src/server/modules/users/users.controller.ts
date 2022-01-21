import {
  Headers,
  Body,
  Param,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseFilters,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UpdateQuery } from 'mongoose';
import { AuthGuard, NoAuth } from '@server/guards/auth.guard';
import { HttpExceptionFilter } from '@server/filters/http-exception.filter';
import { ResponseInterceptor } from '@server/interceptors/transform-interceptor';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Controller('api/users')
@UseGuards(AuthGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(new ResponseInterceptor())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('current')
  @NoAuth()
  async findCurrentUser(@Headers() { token }) {
    return this.usersService.findCurrentUser(token);
  }

  @Get(':id')
  async findById(@Param() { id }): Promise<User> {
    return this.usersService.findById(id);
  }

  @Put()
  async findByIdAndUpdate(@Body() user: UpdateQuery<User>) {
    return this.usersService.findByIdAndUpdate(user);
  }

  @Delete(':id')
  async findByIdAndRemove(@Param() { id }) {
    return this.usersService.findByIdAndRemove(id);
  }
}
