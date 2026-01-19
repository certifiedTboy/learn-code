import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../user/schemas/user-schema';
import * as mongoose from 'mongoose';

export type TicketDocument = mongoose.HydratedDocument<Ticket>;

@Schema({ timestamps: true })
export class Ticket {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 'open' })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ default: Date.now() + 60 * 60 * 24 * 7 * 1000 })
  expiresAt: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
