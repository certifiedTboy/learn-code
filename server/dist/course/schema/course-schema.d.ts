import * as mongoose from 'mongoose';
export type CourseDocument = mongoose.HydratedDocument<Course>;
export declare class Course {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    contents: {
        mainTopic: string;
        description: string;
        subTopics: [{
            title: string;
            contentURI: string;
            isVideo: boolean;
        }];
    }[];
    subscribers: number;
    completed: number;
    price: number;
    rating: number;
    totalTopics: number;
    requiredDuration: number;
    percentageDiscount: number;
    image: string;
    skills: string[];
}
export declare const CourseSchema: mongoose.Schema<Course, mongoose.Model<Course, any, any, any, mongoose.Document<unknown, any, Course, any, {}> & Course & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Course, mongoose.Document<unknown, {}, mongoose.FlatRecord<Course>, {}, mongoose.DefaultSchemaOptions> & mongoose.FlatRecord<Course> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
