import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import type { MongoIDType } from '#types/model';

export type SiteDocument = Site & Document;

@Schema()
export class Site extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  logo: string;

  @Prop({ required: true, validate: /^https?:\/\// })
  url: string;

  @Prop()
  sort: number;

  @Prop({ ref: 'category', type: 'ObjectId' })
  categoryId: MongoIDType;

  @Prop()
  description: string;
}

export const SiteSchema = SchemaFactory.createForClass(Site);
