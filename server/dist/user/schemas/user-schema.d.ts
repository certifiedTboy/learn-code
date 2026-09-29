import * as mongoose from 'mongoose';
export type UserDocument = mongoose.HydratedDocument<User>;
export declare class User {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    verificationCode: string;
    verificationCodeExpiresIn: Date;
    passwordResetCode: string;
    passwordResetCodeExpiresIn: Date;
    profilePicture: string;
    isVerified: boolean;
    role: string;
    password: string;
    registeredCourses: {
        course: mongoose.Types.ObjectId;
        paymentId: number | string;
        dateRegistered: Date;
        completion: string;
    }[];
}
export declare const UserSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, mongoose.Document<unknown, any, User, any, {}> & User & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User, mongoose.Document<unknown, {}, mongoose.FlatRecord<User>, {}, mongoose.DefaultSchemaOptions> & mongoose.FlatRecord<User> & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}>;
