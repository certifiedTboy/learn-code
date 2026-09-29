import { JwtService } from '@nestjs/jwt';
export declare class RefreshJwtService {
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
        _id: string;
    }>;
}
