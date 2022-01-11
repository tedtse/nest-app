import type { MongoIDType } from '../../../types/model';

export type CategoryType = {
  _id: MongoIDType;
  id: string;
  name: string;
  icon: string;
  description?: string;
};

export type CreateCategoryType = Pick<CategoryType, '_id'>;
