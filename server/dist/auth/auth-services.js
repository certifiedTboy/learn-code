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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const passcode_hashing_1 = require("../helpers/passcode-hashing");
const users_service_1 = require("../user/users-service");
const access_jwt_service_1 = require("../common/jwt/access-jwt.service");
const refresh_jwt_service_1 = require("../common/jwt/refresh-jwt-service");
let AuthService = class AuthService {
    usersService;
    accessJwtService;
    refreshJwtService;
    configService;
    constructor(usersService, accessJwtService, refreshJwtService, configService) {
        this.usersService = usersService;
        this.accessJwtService = accessJwtService;
        this.refreshJwtService = refreshJwtService;
        this.configService = configService;
    }
    async signIn(password, email, _clientType) {
        const user = await this.usersService.checkIfUserExist({ email });
        if (!user) {
            throw new common_1.UnauthorizedException('', {
                cause: 'Invalid login credentials',
                description: 'No user with this email exists',
            });
        }
        if (!user.isVerified) {
            throw new common_1.UnauthorizedException('', {
                cause: `Unverified account`,
                description: 'Account is unverified.',
            });
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('', {
                cause: 'Request password reset',
                description: 'Request password reset',
            });
        }
        if (user && user.isVerified) {
            const passwordMatch = await passcode_hashing_1.PasscodeHashing.verifyPassword(password, user.password);
            if (!passwordMatch) {
                throw new common_1.UnauthorizedException('', {
                    cause: `Invalid login credentials`,
                    description: 'Invalid login credentials',
                });
            }
            const payload = {
                email: user.email,
                _id: user._id.toString(),
                role: user.role,
                sub: user.email,
            };
            return {
                accessToken: await this.accessJwtService.signToken(payload),
                refreshToken: await this.refreshJwtService.signToken(payload),
                user,
            };
        }
    }
    async googleSignin(createUserDto) {
        const user = await this.usersService.createGoogleUser(createUserDto);
        if (user && user.isVerified) {
            const payload = {
                email: user.email,
                _id: user._id.toString(),
                role: user.role,
                sub: user.email,
            };
            return {
                accessToken: await this.accessJwtService.signToken(payload),
                refreshToken: await this.refreshJwtService.signToken(payload),
                user,
            };
        }
    }
    async googleAdminSignin(idToken) {
        const clientId = this.configService.get('EMAIL_CLIENT_ID');
        if (!clientId) {
            throw new common_1.InternalServerErrorException('Google sign-in is not configured');
        }
        const response = await axios_1.default.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
        const userData = {
            firstName: response?.data?.given_name,
            lastName: response?.data?.family_name,
            email: response?.data?.email,
            profilePicture: response?.data?.picture,
        };
        const user = await this.usersService.createGoogleUser(userData);
        const tokenPayload = {
            email: user.email,
            _id: user._id.toString(),
            role: user.role,
            sub: user.email,
        };
        return {
            accessToken: await this.accessJwtService.signToken(tokenPayload),
            refreshToken: await this.refreshJwtService.signToken(tokenPayload),
            user,
        };
    }
    async generateNewToken(refreshToken) {
        const { email } = await this.refreshJwtService.verifyToken(refreshToken);
        const userData = await this.usersService.checkIfUserExist({ email });
        if (!userData) {
            throw new common_1.UnauthorizedException('', {
                cause: `Invalid token`,
                description: 'User with this email does not exist',
            });
        }
        const payload = {
            email: userData.email,
            _id: userData._id.toString(),
            role: userData.role,
            sub: userData.email,
        };
        return {
            accessToken: await this.accessJwtService.signToken(payload),
            user: userData,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        access_jwt_service_1.AccessJwtService,
        refresh_jwt_service_1.RefreshJwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth-services.js.map