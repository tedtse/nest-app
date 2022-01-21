import type { MongoIDType } from '../../../types/model';

export type SiteType = {
  _id: string;
  name: string;
  logo: string;
  url: string;
  categoryId: string;
  description?: string;
};

export type CreateSiteType = Pick<SiteType, '_id'>;
