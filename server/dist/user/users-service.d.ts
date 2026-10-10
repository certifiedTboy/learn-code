import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { User } from './schemas/user-schema';
import { UserDocument } from './schemas/user-schema';
import { CreateUserDto, CreateGoogleUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserProfileDTO } from './dto/update-user-profile.dto';
import { AccessJwtService } from '../common/jwt/access-jwt.service';
import { VerifyUserDto } from './dto/verify-user.dto';
import { QueueService } from '../queue/queue-service';
export declare class UsersService {
    private userModel;
    private readonly accessJwtService;
    private readonly queueService;
    private readonly configService;
    constructor(userModel: Model<UserDocument>, accessJwtService: AccessJwtService, queueService: QueueService, configService: ConfigService);
    create(createUserDto: CreateUserDto, _clientType: string): Promise<(import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    createGoogleUser(createUserDto: CreateGoogleUserDto, role?: 'user' | 'admin'): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    verifyUser(verifyUserDto: VerifyUserDto): Promise<UserDocument | null>;
    newVerificationCode(email: string): Promise<UserDocument | null>;
    updateProfile(userId: string, updateUserProfileDto: UpdateUserProfileDTO): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    checkIfUserExist(query: object): Promise<UserDocument | null>;
    checkUserExistById(userId: string): Promise<UserDocument | null>;
    updateUserPassword(updatePasswordDto: UpdatePasswordDto): Promise<UserDocument | null>;
    findAllUsers(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findAllUsersByAdmin(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updateUserOnlineStatus(userId: string, action: string): Promise<UserDocument | null>;
    getResetPasswordCode(email: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    increaseUserUnreadMessageCount(userId: string): Promise<UserDocument | null>;
    clearUserUnreadMessageCount(userId: string): Promise<UserDocument | null>;
}
