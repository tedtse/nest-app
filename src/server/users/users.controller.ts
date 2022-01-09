import {
  Body,
  Param,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateQuery } from 'mongoose';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { ResponseInterceptor } from '../filters/transform-interceptor';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Controller('api/users')
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

  @Post('login')
  async login(@Body() { username, password }) {
    return this.usersService.login(username, password);
  }
}
