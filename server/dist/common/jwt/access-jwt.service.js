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
exports.AccessJwtService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let AccessJwtService = class AccessJwtService {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async signToken(payload) {
        const jwtToken = await this.jwtService.signAsync(payload);
        return jwtToken;
    }
    async verifyToken(token) {
        try {
            const decoded = await this.jwtService.verifyAsync(token);
            return decoded;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('jwt expired', {
                cause: new Error()['message'],
                description: 'jwt expired',
            });
        }
    }
};
exports.AccessJwtService = AccessJwtService;
exports.AccessJwtService = AccessJwtService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AccessJwtService);
//# sourceMappingURL=access-jwt.service.js.map