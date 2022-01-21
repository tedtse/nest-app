import { Model, UpdateQuery, QueryOptions, FilterQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Site } from './schemas/site.schema';

import type { MongoIDType } from '#types/model';

@Injectable()
export class SitesService {
  constructor(
    @InjectModel(Site.name) private readonly siteModel: Model<Site>,
  ) {}

  async create(site: Site) {
    const counts = await this.siteModel.count({
      categoryId: site.categoryId,
    });
    const createSite = new this.siteModel(site);
    createSite.sort = counts + 1;
    return createSite.save();
  }

  async findAll(query: FilterQuery<Site> & QueryOptions) {
    const { options, ...filter } = query;
    return this.siteModel.find(filter, null, options);
  }

  async findById(_id: MongoIDType) {
    return this.siteModel.findById(_id);
  }

  async findByIdAndUpdate(site: UpdateQuery<Site>) {
    return this.siteModel.findByIdAndUpdate(site._id, site, {
      new: true,
      runValidators: true,
    });
  }

  async findByIdAndRemove(_id: MongoIDType) {
    const removeSite = await this.siteModel.findByIdAndRemove(_id);
    const needUpdateSites = await this.siteModel.find({
      sort: { $gt: removeSite.sort },
    });
    needUpdateSites.forEach(async (site) => {
      site.sort = site.sort - 1;
      await site.save();
    });
    return null;
  }

  async sort(categoryId: string, targets: Site[]) {
    const sources = await this.siteModel.find({ categoryId });
    targets.forEach(async (tar, index) => {
      const sou = sources.find((el) => el._id.toJSON() === tar._id);
      if (sou.sort != index + 1) {
        sou.sort = index + 1;
        await sou.save();
      }
    });
    return sources;
  }
}
