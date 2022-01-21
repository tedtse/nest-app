import { Model, UpdateQuery } from 'mongoose';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { AuthService } from '@server/modules/auth/auth.service';
import { jwtConstants } from '@server/constants';

import type { MongoIDType } from '#types/model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {
    this.userModel.count((err, count) => {
      if (err) throw err;
      if (!count) {
        const createUser = new this.userModel({
          name: 'admin',
          password: 'admin',
          email: 'admin@xxx.com',
        });
        createUser.save();
      }
    });
  }

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

  async findCurrentUser(token: string) {
    let decode: any;
    try {
      decode = jwt.verify(token, jwtConstants.secret);
    } catch (err) {
      return null;
    }
    const blackToken = await this.authService.findBlackToken({
      token,
      userId: decode._id,
    });
    if (blackToken) {
      return null;
    }
    return this.findById(decode._id);
  }
}
