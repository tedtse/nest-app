import { Model, UpdateQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';

import type { MongoIDType } from '../../../types/model';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async create(category: Category) {
    const createCategory = new this.categoryModel(category);
    return createCategory.save();
  }

  async findAll() {
    return this.categoryModel.find();
  }

  async findById(_id: MongoIDType) {
    return this.categoryModel.findById(_id);
  }

  async findByIdAndUpdate(category: UpdateQuery<Category>) {
    return this.categoryModel.findByIdAndUpdate(category._id, category, {
      new: true,
    });
  }

  async findByIdAndRemove(_id: MongoIDType) {
    await this.categoryModel.findByIdAndRemove(_id);
    return null;
  }
}
