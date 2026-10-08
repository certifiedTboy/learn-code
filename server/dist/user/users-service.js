"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const passcode_hashing_1 = require("../helpers/passcode-hashing");
const user_schema_1 = require("./schemas/user-schema");
const code_generator_1 = require("../helpers/code-generator");
const access_jwt_service_1 = require("../common/jwt/access-jwt.service");
const time_1 = require("../helpers/time");
const queue_service_1 = require("../queue/queue-service");
let UsersService = class UsersService {
    userModel;
    accessJwtService;
    queueService;
    configService;
    constructor(userModel, accessJwtService, queueService, configService) {
        this.userModel = userModel;
        this.accessJwtService = accessJwtService;
        this.queueService = queueService;
        this.configService = configService;
    }
    async create(createUserDto, _clientType) {
        const userWithEmailExist = await this.checkIfUserExist({
            email: createUserDto.email,
        });
        const otp = code_generator_1.CodeGenerator.generateOtp();
        const verificationCodeExpiresIn = time_1.Time.getTimeInOneHour();
        if (userWithEmailExist) {
            if (!userWithEmailExist?.isVerified) {
                if (time_1.Time.checkIfTimeIsExpired(userWithEmailExist.verificationCodeExpiresIn)) {
                    const updatedUser = await this.userModel.findOneAndUpdate({ email: userWithEmailExist.email }, {
                        verificationCode: otp.split('').slice(0, -1).join(''),
                        isVerified: false,
                        verificationCodeExpiresIn,
                        password: await passcode_hashing_1.PasscodeHashing.hashPassword(createUserDto.password),
                    }, { new: true });
                    await this.queueService.addJob('email-verification', {
                        email: updatedUser.email,
                        subject: 'Learn Code Account Verification',
                        verificationCode: otp,
                        firstName: updatedUser.firstName || updatedUser.email,
                    }, 10000);
                    return updatedUser;
                }
                else {
                    await this.userModel.findOneAndUpdate({ email: userWithEmailExist.email }, {
                        verificationCode: otp.split('').slice(0, -1).join(''),
                        isVerified: false,
                        verificationCodeExpiresIn,
                        password: await passcode_hashing_1.PasscodeHashing.hashPassword(createUserDto.password),
                    }, { new: true });
                    await this.queueService.addJob('email-verification', {
                        email: userWithEmailExist.email,
                        subject: 'Learn Code Account Verification',
                        verificationCode: otp,
                        firstName: userWithEmailExist.firstName || userWithEmailExist.email,
                    }, 10000);
                    return userWithEmailExist;
                }
            }
            throw new common_1.BadRequestException('', {
                cause: 'User with this email exist',
                description: 'invalid credentials',
            });
        }
        const createdUser = new this.userModel({
            ...createUserDto,
            verificationCode: otp.split('').slice(0, -1).join(''),
            verificationCodeExpiresIn: verificationCodeExpiresIn,
            password: await passcode_hashing_1.PasscodeHashing.hashPassword(createUserDto.password),
        });
        const user = await createdUser.save();
        await this.queueService.addJob('email-verification', {
            email: user.email,
            subject: 'Learn Code Account Verification',
            verificationCode: otp,
            firstName: user.firstName,
        }, 10000);
        return user;
    }
    async createGoogleUser(createUserDto, role = 'user') {
        const userWithEmailExist = await this.checkIfUserExist({
            email: createUserDto.email,
        });
        if (userWithEmailExist) {
            return userWithEmailExist;
        }
        else {
            const createdUser = new this.userModel({
                ...createUserDto,
                isVerified: true,
                role,
            });
            const user = await createdUser.save();
            await this.queueService.addJob('email-account-setup-success', {
                email: user.email,
                subject: 'Account Setup Successful',
                firstName: user?.firstName || user.email,
            }, 10000);
            return user;
        }
    }
    async verifyUser(verifyUserDto) {
        if (verifyUserDto.action === 'ACCOUNT_VERIFICATION') {
            const user = await this.checkIfUserExist({
                verificationCode: verifyUserDto.verificationCode,
            });
            if (!user) {
                throw new common_1.BadRequestException('', {
                    cause: 'invalid verification code',
                    description: 'Invalid verification code',
                });
            }
            if (time_1.Time.checkIfTimeIsExpired(user.verificationCodeExpiresIn)) {
                throw new common_1.BadRequestException('', {
                    cause: 'Code has expired',
                    description: 'Please request a new verification code',
                });
            }
            const updatedUser = await this.userModel.findOneAndUpdate({ _id: user?._id }, {
                isVerified: true,
                isActive: true,
                verificationCode: null,
                verificationCodeExpiresIn: null,
            }, { new: true });
            await this.queueService.addJob('email-account-setup-success', {
                email: updatedUser.email,
                subject: 'Account Setup Successful',
                firstName: updatedUser?.firstName || updatedUser.email,
            }, 10000);
            return updatedUser;
        }
        else {
            const user = await this.checkIfUserExist({
                passwordResetCode: verifyUserDto.verificationCode,
            });
            if (!user) {
                throw new common_1.BadRequestException('', {
                    cause: 'invalid password reset code',
                    description: 'Invalid password reset code',
                });
            }
            if (time_1.Time.checkIfTimeIsExpired(user.passwordResetCodeExpiresIn)) {
                throw new common_1.BadRequestException('', {
                    cause: 'Code has expired',
                    description: 'Please request a new verification code',
                });
            }
            const updatedUser = await this.userModel.findOneAndUpdate({ _id: user?._id }, {
                isVerified: true,
                isActive: true,
                passwordResetCodeExpiresIn: null,
            }, { new: true });
            return updatedUser;
        }
    }
    async newVerificationCode(email) {
        const userExist = await this.checkIfUserExist({ email });
        if (!userExist) {
            throw new common_1.BadRequestException('', {
                cause: 'User not found',
                description: 'User does not exist',
            });
        }
        const otp = code_generator_1.CodeGenerator.generateOtp();
        const verificationCodeExpiresIn = time_1.Time.getTimeInOneHour();
        const updatedUser = await this.userModel.findOneAndUpdate({ email }, {
            verificationCode: otp.split('').slice(0, -1).join(''),
            verificationCodeExpiresIn,
        }, { new: true });
        await this.queueService.addJob('email-verification', {
            email: updatedUser.email,
            subject: 'Learn Code Account Verification',
            verificationCode: otp,
            firstName: updatedUser.firstName || updatedUser.email,
        }, 10000);
        return updatedUser;
    }
    async updateProfile(userId, updateUserProfileDto) {
        const updatedUser = await this.userModel.findOneAndUpdate({ _id: userId }, {
            firstName: updateUserProfileDto.firstName,
            lastName: updateUserProfileDto.lastName,
        }, { new: true });
        if (!updatedUser) {
            throw new common_1.BadRequestException('', {
                cause: 'Failed to update profile',
                description: 'Failed to update profile',
            });
        }
        return updatedUser;
    }
    async checkIfUserExist(query) {
        return this.userModel
            .findOne(query)
            .select('-__v')
            .populate('registeredCourses.course');
    }
    async checkUserExistById(userId) {
        return this.userModel
            .findById(userId)
            .select('-passcode -verificationCode -verificationCodeExpiresIn -__v -passwordResetToken -passwordResetTokenExpiresIn');
    }
    async updateUserPassword(updatePasswordDto) {
        const { password, passwordResetCode } = updatePasswordDto;
        const user = await this.checkIfUserExist({ passwordResetCode });
        if (!user) {
            throw new common_1.BadRequestException('', {
                cause: 'Invalid password reset code',
                description: 'Invalid password reset code',
            });
        }
        const hashedPassword = await passcode_hashing_1.PasscodeHashing.hashPassword(password);
        const updatedUser = await this.userModel.findOneAndUpdate({ passwordResetCode }, {
            password: hashedPassword,
            passwordResetCode: null,
            passwordResetCodeExpiresIn: null,
            isVerified: true,
        }, { new: true });
        if (!updatedUser) {
            throw new common_1.BadRequestException('', {
                cause: 'Failed to update password',
                description: 'Failed to update password',
            });
        }
        await this.queueService.addJob('email-password-change-success', {
            email: updatedUser.email,
            subject: 'Password Reset Successful',
            firstName: updatedUser.firstName,
        }, 10000);
        return updatedUser;
    }
    async findAllUsers() {
        return this.userModel
            .find()
            .select('-passcode -verificationCode -verificationCodeExpiresIn -__v, -passwordResetToken, -passwordResetTokenExpiresIn')
            .exec();
    }
    async findAllUsersByAdmin() {
        return this.userModel
            .find({ role: 'user' })
            .select('-passcode -verificationCode -verificationCodeExpiresIn -__v, -passwordResetToken, -passwordResetTokenExpiresIn')
            .exec();
    }
    async updateUserOnlineStatus(userId, action) {
        if (action === 'offline') {
            return this.userModel.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() }, { new: true });
        }
        else {
            return this.userModel.findByIdAndUpdate(userId, { isOnline: true }, { new: true });
        }
    }
    async getResetPasswordCode(email) {
        const user = await this.checkIfUserExist({ email });
        if (!user) {
            throw new common_1.BadRequestException('', {
                cause: 'Email does not exist',
                description: 'User does not exist',
            });
        }
        const otp = code_generator_1.CodeGenerator.generateOtp();
        const updatedUser = await this.userModel.findOneAndUpdate({ email: user?.email }, {
            passwordResetCode: otp.split('').slice(0, -1).join(''),
            passwordResetCodeExpiresIn: time_1.Time.getTimeInOneHour(),
            isVerified: false,
        }, { new: true });
        await this.queueService.addJob('email-password-reset', {
            email: updatedUser.email,
            subject: 'Password Reset Request',
            passwordResetCode: otp,
            firstName: updatedUser.firstName,
        }, 10000);
        return updatedUser;
    }
    async increaseUserUnreadMessageCount(userId) {
        return this.userModel.findByIdAndUpdate(userId, { $inc: { unreadMessagesCount: 1 } }, { new: true });
    }
    async clearUserUnreadMessageCount(userId) {
        return this.userModel.findByIdAndUpdate(userId, { $set: { unreadMessagesCount: 0 } }, { new: true });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        access_jwt_service_1.AccessJwtService,
        queue_service_1.QueueService,
        config_1.ConfigService])
], UsersService);
//# sourceMappingURL=users-service.js.map