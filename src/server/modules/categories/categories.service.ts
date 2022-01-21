import { Model, UpdateQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';

import type { MongoIDType } from '#types/model';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async create(category: Category) {
    const counts = await this.categoryModel.count();
    const createCategory = new this.categoryModel(category);
    createCategory.sort = counts + 1;
    return createCategory.save();
  }

  async findAll(options = {}) {
    return this.categoryModel.find({}, null, options);
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
    const removeCategory = await this.categoryModel.findByIdAndRemove(_id);
    const needUpdateCategories = await this.categoryModel.find({
      sort: { $gt: removeCategory.sort },
    });
    needUpdateCategories.forEach(async (category) => {
      category.sort = category.sort - 1;
      await category.save();
    });
    return null;
  }

  async sort(targets: Category[]) {
    const sources = await this.categoryModel.find();
    targets.forEach(async (tar, index) => {
      const sou = sources.find((el) => el._id.toJSON() === tar._id);
      if (sou.sort !== index + 1) {
        sou.sort = index + 1;
        await sou.save();
      }
    });
    return sources;
  }
}
