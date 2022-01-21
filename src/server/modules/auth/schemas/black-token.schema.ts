import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import type { MongoIDType } from 'src/types/model';

export type BlackTokenDocument = BlackToken & Document;

@Schema()
export class BlackToken extends Document {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true, ref: 'user', type: 'ObjectId' })
  userId: MongoIDType;
}

export const BlackTokenSchema = SchemaFactory.createForClass(BlackToken);
