import { JwtService } from '@nestjs/jwt';
export declare class AccessJwtService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    signToken(payload: {
        email: string;
        sub: string;
        token?: string;
    }): Promise<string>;
    verifyToken(token: string): Promise<{
        email: string;
        iat: string;
        sub: string;
        exp: string;
        token: string;
        role?: string;
        _id: string;
    }>;
}
