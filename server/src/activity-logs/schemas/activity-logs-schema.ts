import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../user/schemas/user-schema';
import * as mongoose from 'mongoose';

export type ActivityLogDocument = mongoose.HydratedDocument<ActivityLog>;

@Schema({ timestamps: true })
export class ActivityLog {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  createdFor: string;

  @Prop({ default: Date.now() + 60 * 60 * 24 * 7 * 1000 }) // default 7 days
  expiresAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

ActivityLogSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
