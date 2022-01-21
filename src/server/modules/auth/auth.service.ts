import { Model, FilterQuery } from 'mongoose';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { BlackToken } from './schemas/black-token.schema';
import { User } from '@server/modules/users/schemas/user.schema';
import { jwtConstants } from '@server/constants';

import type { MongoIDType } from '#types/model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(BlackToken.name) private blackTokenModel: Model<BlackToken>,
  ) {}

  async createBlackToken(data: { token: string; userId: MongoIDType }) {
    const blackToken = new this.blackTokenModel(data);
    await blackToken.save();
    return blackToken;
  }

  async findBlackToken(filter: FilterQuery<BlackToken>) {
    return this.blackTokenModel.findOne(filter);
  }

  async findBlackTokenById(_id: MongoIDType) {
    return this.blackTokenModel.findById(_id);
  }

  async findBlackTokenByIdAndRemove(_id: MongoIDType) {
    await this.blackTokenModel.findByIdAndRemove(_id);
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
    const token = jwt.sign(_user, jwtConstants.secret, {
      expiresIn: jwtConstants.expiresIn,
    });
    return {
      ..._user,
      token,
    };
  }

  async logout(token: string) {
    let decode: any;
    try {
      decode = jwt.verify(token, jwtConstants.secret);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
    if (!decode._id) {
      throw new UnauthorizedException('非法的token');
    }
    await this.createBlackToken({ token, userId: decode._id });
    return null;
  }
}
