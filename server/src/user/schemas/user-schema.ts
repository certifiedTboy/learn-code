import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: null })
  verificationCode: string;

  @Prop()
  verificationCodeExpiresIn: Date;

  @Prop()
  passwordResetCode: string;

  @Prop()
  passwordResetCodeExpiresIn: Date;

  @Prop({ default: null })
  profilePicture: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: 'user' })
  role: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
