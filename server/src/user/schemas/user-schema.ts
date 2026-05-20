import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id: mongoose.Types.ObjectId;

  @Prop()
  firstName: string;

  @Prop()
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

  @Prop({
    type: [
      {
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        dateRegistered: { type: Date },
        paymentId: { type: mongoose.Schema.Types.Mixed },
        completion: { type: String },
      },
    ],
  })
  registeredCourses: {
    course: mongoose.Types.ObjectId;
    paymentId: number | string;
    dateRegistered: Date;
    completion: string;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
