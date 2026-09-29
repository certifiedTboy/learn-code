import { UsersService } from '../user/users-service';
import { AccessJwtService } from '../common/jwt/access-jwt.service';
import { RefreshJwtService } from "../common/jwt/refresh-jwt-service";
import { CreateGoogleUserDto } from "../user/dto/create-user.dto";
export declare class AuthService {
    private readonly usersService;
    private readonly accessJwtService;
    private readonly refreshJwtService;
    constructor(usersService: UsersService, accessJwtService: AccessJwtService, refreshJwtService: RefreshJwtService);
    signIn(password: string, email: string, clientType: string): Promise<{
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
    generateNewToken(refreshToken: string): Promise<{
        accessToken: string;
        user: import("mongoose").Document<unknown, {}, import("../user/schemas/user-schema").User, {}, {}> & import("../user/schemas/user-schema").User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
}
