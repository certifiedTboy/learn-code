import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AccessJwtService } from '../common/jwt/access-jwt.service';
interface UserPayload {
    _id: string;
    email: string;
    role?: string;
}
declare module 'express' {
    interface Request {
        user: UserPayload;
    }
}
export declare class AuthGuard implements CanActivate {
    private readonly jwtService;
    constructor(jwtService: AccessJwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare class AdminGuard implements CanActivate {
    private readonly jwtService;
    constructor(jwtService: AccessJwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
