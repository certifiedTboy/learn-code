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
exports.AuthControllers = void 0;
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
const auth_services_1 = require("./auth-services");
const auth_dto_1 = require("./dto/auth.dto");
const auth_guard_1 = require("../guard/auth-guard");
const response_handler_1 = require("../common/response-handler/response-handler");
const users_service_1 = require("../user/users-service");
const create_user_dto_1 = require("../user/dto/create-user.dto");
let AuthControllers = class AuthControllers {
    authService;
    usersService;
    logger;
    clientType = '';
    constructor(authService, usersService, logger) {
        this.authService = authService;
        this.usersService = usersService;
        this.logger = logger;
    }
    async login(req, authDto) {
        try {
            const { password, email } = authDto;
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: 'Signin in user with email and password',
                email: authDto.email,
                clientType: this.clientType,
            });
            const result = await this.authService.signIn(password, email, this.clientType);
            return response_handler_1.ResponseHandler.ok(200, 'login successful', result);
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    email: authDto.email,
                    clientType: this.clientType,
                });
                throw new common_1.BadRequestException('', {
                    cause: error.cause,
                    description: error.message,
                });
            }
        }
    }
    async loginWithGoogle(req, createUserDto) {
        try {
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: 'Signin in user with google',
                email: createUserDto.email,
                clientType: this.clientType,
            });
            const result = await this.authService.googleSignin(createUserDto);
            return response_handler_1.ResponseHandler.ok(200, 'login successful', result);
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    email: createUserDto.email,
                    clientType: this.clientType,
                });
                throw new common_1.BadRequestException('', {
                    cause: error.cause,
                    description: error.message,
                });
            }
        }
    }
    async loginAdminWithGoogle(req, idToken) {
        this.clientType = req.headers['x-client-type'];
        if (!idToken) {
            throw new common_1.BadRequestException('Google identity token is required');
        }
        try {
            const result = await this.authService.googleAdminSignin(idToken);
            return response_handler_1.ResponseHandler.ok(200, 'login successful', result);
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.message,
                    clientType: this.clientType,
                });
            }
            throw error;
        }
    }
    async getCurrentUser(req) {
        const currentUser = req.user;
        try {
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: 'Fetching current user',
                email: currentUser?.email,
                clientType: this.clientType,
            });
            if (!currentUser) {
                throw new common_1.BadRequestException('', {
                    cause: 'Unauthorized access',
                    description: 'User not authenticated',
                });
            }
            const user = await this.usersService.checkUserExistById(currentUser?._id);
            if (user) {
                return response_handler_1.ResponseHandler.ok(200, 'User retrieved successfully', user);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    email: currentUser?.email,
                    clientType: this.clientType,
                });
                throw new common_1.InternalServerErrorException('', {
                    cause: error.cause,
                    description: error.message,
                });
            }
        }
    }
    logout(req, res) {
        try {
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: 'User logging out',
                clientType: this.clientType,
            });
            res.clearCookie('accessToken');
            return response_handler_1.ResponseHandler.ok(200, 'User logged out successfully', undefined);
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    clientType: this.clientType,
                });
                throw new common_1.InternalServerErrorException('', {
                    cause: error.cause,
                    description: error.message,
                });
            }
        }
    }
    async getNewtoken(req, res) {
        try {
            this.clientType = req.headers['x-client-type'];
            this.logger.info({
                level: 'info',
                message: 'Generating new token',
                clientType: this.clientType,
            });
            const refreshToken = req.headers['authorization']?.split(' ')[1];
            if (!refreshToken) {
                throw new common_1.BadRequestException('', {
                    cause: 'Invalid request',
                    description: 'Refresh token is required',
                });
            }
            const result = await this.authService.generateNewToken(refreshToken);
            return response_handler_1.ResponseHandler.ok(200, 'new token generated successfully', result);
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    level: 'error',
                    message: error.cause,
                    clientType: this.clientType,
                });
                throw new common_1.InternalServerErrorException('', {
                    cause: error.cause,
                    description: error.message,
                });
            }
        }
    }
};
exports.AuthControllers = AuthControllers;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.AuthDto]),
    __metadata("design:returntype", Promise)
], AuthControllers.prototype, "login", null);
__decorate([
    (0, common_1.Post)('google/login'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.CreateGoogleUserDto]),
    __metadata("design:returntype", Promise)
], AuthControllers.prototype, "loginWithGoogle", null);
__decorate([
    (0, common_1.Post)('google/admin/login'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('idToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthControllers.prototype, "loginAdminWithGoogle", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthControllers.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Get)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthControllers.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('new-token'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthControllers.prototype, "getNewtoken", null);
exports.AuthControllers = AuthControllers = __decorate([
    (0, common_1.Controller)({
        path: 'auth',
        version: '1',
    }),
    __param(2, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [auth_services_1.AuthService,
        users_service_1.UsersService,
        winston_1.Logger])
], AuthControllers);
//# sourceMappingURL=auth.contollers.js.map