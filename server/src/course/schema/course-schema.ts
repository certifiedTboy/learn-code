import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type CourseDocument = mongoose.HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  _id: mongoose.Types.ObjectId;

  @Prop({ unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  contents: {
    mainTopic: string;
    description: string;
    subTopics: [{ title: string; contentURI: string; isVideo: boolean }];
  }[];

  @Prop()
  subscribers: number;

  @Prop()
  completed: number;

  @Prop()
  price: number;

  @Prop()
  rating: number;

  @Prop()
  totalTopics: number;

  @Prop()
  requiredDuration: number;

  @Prop()
  percentageDiscount: number;

  @Prop()
  image: string;

  @Prop()
  skills: string[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
