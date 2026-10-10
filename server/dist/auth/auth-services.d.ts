import { ConfigService } from '@nestjs/config';
import { UsersService } from '../user/users-service';
import { AccessJwtService } from '../common/jwt/access-jwt.service';
import { RefreshJwtService } from "../common/jwt/refresh-jwt-service";
import { CreateGoogleUserDto } from "../user/dto/create-user.dto";
export declare class AuthService {
    private readonly usersService;
    private readonly accessJwtService;
    private readonly refreshJwtService;
    private readonly configService;
    constructor(usersService: UsersService, accessJwtService: AccessJwtService, refreshJwtService: RefreshJwtService, configService: ConfigService);
    signIn(password: string, email: string, _clientType: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: import("mongoose").Document<unknown, {}, import("../user/schemas/user-schema").User, {}, {}> & import("../user/schemas/user-schema").User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    } | undefined>;
    googleSignin(createUserDto: CreateGoogleUserDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: import("mongoose").Document<unknown, {}, import("../user/schemas/user-schema").User, {}, {}> & import("../user/schemas/user-schema").User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    } | undefined>;
    googleAdminSignin(idToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: import("mongoose").Document<unknown, {}, import("../user/schemas/user-schema").User, {}, {}> & import("../user/schemas/user-schema").User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    generateNewToken(refreshToken: string): Promise<{
        accessToken: string;
        user: import("mongoose").Document<unknown, {}, import("../user/schemas/user-schema").User, {}, {}> & import("../user/schemas/user-schema").User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
}
