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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
const users_service_1 = require("./users-service");
const create_user_dto_1 = require("./dto/create-user.dto");
const verify_user_dto_1 = require("./dto/verify-user.dto");
const update_user_profile_dto_1 = require("./dto/update-user-profile.dto");
const generate_token_dto_1 = require("./dto/generate-token.dto");
const update_password_dto_1 = require("./dto/update-password.dto");
const response_handler_1 = require("../common/response-handler/response-handler");
const auth_guard_1 = require("../guard/auth-guard");
let UsersController = class UsersController {
    usersService;
    logger;
    clientType = '';
    constructor(usersService, logger) {
        this.usersService = usersService;
        this.logger = logger;
    }
    async getAllUsers(req) {
        try {
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: 'Fetching all users',
                clientType: this.clientType,
            });
            const result = await this.usersService.findAllUsersByAdmin();
            return response_handler_1.ResponseHandler.ok(200, 'Users retrieved successfully', result || []);
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    clientType: this.clientType,
                });
                throw new common_2.InternalServerErrorException('Something went wrong', {
                    cause: error.cause,
                    description: error.message,
                });
            }
            throw new common_2.InternalServerErrorException('Something went wrong', {
                cause: 'Internal server error',
                description: 'An unexpected error occurred',
            });
        }
    }
    async createUser(createUserDto, req) {
        try {
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: 'Creating a new user',
                email: createUserDto.email,
                clientType: this.clientType,
            });
            const result = await this.usersService.create(createUserDto, this.clientType);
            return response_handler_1.ResponseHandler.ok(201, 'User created successfully', result || {});
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    email: createUserDto.email,
                    clientType: this.clientType,
                });
                throw new common_2.InternalServerErrorException('Something went wrong', {
                    cause: error.cause,
                    description: error.message,
                });
            }
            throw new common_2.InternalServerErrorException('Something went wrong', {
                cause: 'Internal server error',
                description: 'An unexpected error occurred',
            });
        }
    }
    async verifyUser(req, verifyUserDto) {
        try {
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: 'Verifying user',
                clientType: this.clientType,
            });
            const result = await this.usersService.verifyUser(verifyUserDto);
            if (result?.verificationCode) {
                return response_handler_1.ResponseHandler.ok(200, `verification code updated`, result);
            }
            return response_handler_1.ResponseHandler.ok(200, 'User verified successfully', result);
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    clientType: this.clientType,
                });
                throw new common_2.InternalServerErrorException('Something went wrong', {
                    cause: error.cause,
                    description: error.message,
                });
            }
            throw new common_2.InternalServerErrorException('Something went wrong', {
                cause: 'Internal server error',
                description: 'An unexpected error occurred',
            });
        }
    }
    async getCurrentUser(req) {
        try {
            const { email } = req.user;
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: 'Fetching current user',
                email,
                clientType: this.clientType,
            });
            const user = await this.usersService.checkIfUserExist({
                email,
            });
            return response_handler_1.ResponseHandler.ok(200, 'Current user retrieved successfully', user);
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    email: req.user?.email,
                    clientType: this.clientType,
                });
                throw new common_2.InternalServerErrorException('Something went wrong', {
                    cause: error.cause,
                    description: error.message,
                });
            }
            throw new common_2.InternalServerErrorException('Something went wrong', {
                cause: 'Internal server error',
                description: 'An unexpected error occurred',
            });
        }
    }
    async updateUserProfile(req, updateUserProfileDto) {
        try {
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: 'Updating user profile',
                clientType: this.clientType,
            });
            const result = await this.usersService.updateProfile(req?.user?._id, updateUserProfileDto);
            return response_handler_1.ResponseHandler.ok(200, 'Profile updated successfully', result);
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    clientType: this.clientType,
                });
                throw new common_2.InternalServerErrorException('Something went wrong', {
                    cause: error.cause,
                    description: error.message,
                });
            }
            throw new common_2.InternalServerErrorException('Something went wrong', {
                cause: 'Internal server error',
                description: 'An unexpected error occurred',
            });
        }
    }
    async generateNewVerificationCode(req, generateNewTokenDto) {
        try {
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: 'Generating new verification code',
                email: generateNewTokenDto.email,
                clientType: this.clientType,
            });
            const { email } = generateNewTokenDto;
            if (!email) {
                throw new common_2.BadRequestException('', {
                    cause: 'Email is required',
                    description: 'Please provide a valid email address',
                });
            }
            const updatedUser = await this.usersService.newVerificationCode(email);
            if (!updatedUser) {
                throw new common_2.BadRequestException('', {
                    cause: 'User not found',
                    description: 'No user found with the provided email address',
                });
            }
            return response_handler_1.ResponseHandler.ok(201, 'New Verification code sent', updatedUser);
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    email: generateNewTokenDto.email,
                    clientType: this.clientType,
                });
                throw new common_2.InternalServerErrorException('', {
                    cause: error.cause,
                    description: error.message,
                });
            }
            throw new common_2.InternalServerErrorException('Something went wrong', {
                cause: 'Internal server error',
                description: 'An unexpected error occurred',
            });
        }
    }
    async requestPasscodeReset(req, passcodeResetDto) {
        try {
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: 'Requesting password reset code',
                email: passcodeResetDto.email,
                clientType: this.clientType,
            });
            const { email } = passcodeResetDto;
            if (!email) {
                throw new common_2.BadRequestException('', {
                    cause: 'Email is required',
                    description: 'Email is required',
                });
            }
            const user = await this.usersService.getResetPasswordCode(email);
            return response_handler_1.ResponseHandler.ok(200, 'Password reset code sent', {
                email: user?.email,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    email: passcodeResetDto.email,
                    clientType: this.clientType,
                });
                throw new common_2.InternalServerErrorException('', {
                    cause: error.cause,
                    description: error.message,
                });
            }
            throw new common_2.InternalServerErrorException('Something went wrong', {
                cause: 'Internal server error',
                description: 'An unexpected error occurred',
            });
        }
    }
    async updatePassword(req, updatePasswordDto) {
        try {
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: 'Updating user password',
                clientType: this.clientType,
            });
            const { password, passwordResetCode } = updatePasswordDto;
            if (!password || !passwordResetCode) {
                throw new common_2.BadRequestException('', {
                    cause: 'Password and password reset code are required',
                    description: 'Please provide a valid password and password reset code',
                });
            }
            if (password !== updatePasswordDto.confirmPassword) {
                throw new common_2.BadRequestException('', {
                    cause: 'Passwords do not match',
                    description: 'Passwords do not match',
                });
            }
            const updatedUser = await this.usersService.updateUserPassword(updatePasswordDto);
            if (!updatedUser) {
                throw new common_2.BadRequestException('', {
                    cause: 'passcode update failed',
                    description: 'passcode failed to be updated',
                });
            }
            return response_handler_1.ResponseHandler.ok(200, 'Passcode updated successfully', updatedUser);
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    clientType: this.clientType,
                });
                throw new common_2.InternalServerErrorException('', {
                    cause: error.cause,
                    description: error.message,
                });
            }
            throw new common_2.InternalServerErrorException('Something went wrong', {
                cause: 'Internal server error',
                description: 'An unexpected error occurred',
            });
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(''),
    (0, common_1.UseGuards)(auth_guard_1.AdminGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Patch)('verify'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, verify_user_dto_1.VerifyUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "verifyUser", null);
__decorate([
    (0, common_1.Get)('current-user'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Patch)('current-user/update'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_profile_dto_1.UpdateUserProfileDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserProfile", null);
__decorate([
    (0, common_1.Post)('new-verification-code'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, generate_token_dto_1.GenerateNewTokenDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "generateNewVerificationCode", null);
__decorate([
    (0, common_1.Post)('password/reset'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, generate_token_dto_1.GenerateNewTokenDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "requestPasscodeReset", null);
__decorate([
    (0, common_1.Patch)('password/reset/update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_password_dto_1.UpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePassword", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)({
        path: 'users',
        version: '1',
    }),
    __param(1, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        winston_1.Logger])
], UsersController);
//# sourceMappingURL=users-controllers.js.map