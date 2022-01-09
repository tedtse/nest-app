import type { MongoIDType } from '../../../types/model';

export type CategoryType = {
  _id: MongoIDType;
  name: string;
  icon: string;
  description?: string;
};

export type CreateCategoryType = Pick<CategoryType, '_id'>;
