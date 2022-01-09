import { Model, UpdateQuery } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

import type { MongoIDType } from '../../types/model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createUser = new this.userModel(createUserDto);
    const user = await createUser.save();
    const _user = user.toJSON();
    delete _user.password;
    return _user;
  }

  async findAll() {
    return this.userModel.find({}, { password: 0 });
  }

  async findById(_id: MongoIDType) {
    return this.userModel.findById(_id, { password: 0 });
  }

  async findByIdAndUpdate(user: UpdateQuery<User>) {
    return this.userModel.findByIdAndUpdate(user._id, user, {
      projection: { password: 0 },
      new: true,
    });
  }

  async findByIdAndRemove(_id: MongoIDType) {
    await this.userModel.findByIdAndRemove(_id);
    return null;
  }

  async login(search: string, password: string) {
    const user = await this.userModel.findOne({
      $or: [{ name: search }, { email: search }],
    });
    if (!user) {
      throw new NotFoundException('不存在该用户名或邮箱');
    }
    if (user.password !== password) {
      throw new NotFoundException('用户名或密码不对');
    }
    const _user = user.toJSON();
    delete _user.password;
    const token = jwt.sign(_user, 'secretkey', {
      expiresIn: '8h',
    });
    return {
      ..._user,
      token,
    };
  }
}
