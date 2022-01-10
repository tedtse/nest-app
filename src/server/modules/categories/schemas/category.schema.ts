import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import type { MongoIDType } from '../../../../types/model';

export type CategoryDocument = Category & Document;

@Schema()
export class Category extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ type: 'ObjectId' })
  id: MongoIDType;

  @Prop()
  description: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.pre('save', function (next) {
  this.id = this._id;
  next();
});
