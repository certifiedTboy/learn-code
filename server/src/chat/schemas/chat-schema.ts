import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user-schema';
import * as mongoose from 'mongoose';

export type ChatDocument = mongoose.HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  senderId: User;

  @Prop()
  message: string;

  @Prop()
  roomId: string;

  @Prop({ default: Date.now() + 60 * 60 * 24 * 7 * 1000 }) // default 7 days
  expiresAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

ChatSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
