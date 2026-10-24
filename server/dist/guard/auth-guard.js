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
exports.AdminGuard = exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const access_jwt_service_1 = require("../common/jwt/access-jwt.service");
let AuthGuard = class AuthGuard {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        if (authHeader?.split(' ')[0] !== 'Bearer') {
            throw new common_1.UnauthorizedException('Invalid token format', {
                cause: 'Unauthorized access',
                description: 'Unauthorized access',
            });
        }
        const accessToken = authHeader.split(' ')[1];
        if (accessToken) {
            const payload = await this.jwtService.verifyToken(accessToken);
            request.user = {
                _id: payload._id,
                email: payload.email,
                role: payload.role,
            };
            return true;
        }
        else {
            throw new common_1.UnauthorizedException('jwt expired', {
                cause: 'Unauthorized access',
                description: 'Unauthorized access',
            });
        }
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [access_jwt_service_1.AccessJwtService])
], AuthGuard);
let AdminGuard = class AdminGuard {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        if (authHeader?.split(' ')[0] !== 'Bearer') {
            throw new common_1.UnauthorizedException('Invalid token format', {
                cause: 'Unauthorized access',
                description: 'Unauthorized access',
            });
        }
        const accessToken = authHeader.split(' ')[1];
        if (accessToken) {
            const payload = await this.jwtService.verifyToken(accessToken);
            if (payload.role !== 'admin') {
                throw new common_1.UnauthorizedException('Forbidden resource', {
                    cause: 'Forbidden access',
                    description: 'You do not have permission to access this resource',
                });
            }
            request.user = {
                _id: payload._id,
                email: payload.email,
                role: payload.role,
            };
            return true;
        }
        else {
            throw new common_1.UnauthorizedException('jwt expired', {
                cause: 'Unauthorized access',
                description: 'Unauthorized access',
            });
        }
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [access_jwt_service_1.AccessJwtService])
], AdminGuard);
//# sourceMappingURL=auth-guard.js.map