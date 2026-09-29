import { Request, Response } from 'express';
import { Logger } from 'winston';
import { AuthService } from './auth-services';
import { AuthDto } from './dto/auth.dto';
import { UsersService } from '../user/users-service';
import { CreateGoogleUserDto } from "../user/dto/create-user.dto";
export declare class AuthControllers {
    private readonly authService;
    private readonly usersService;
    private readonly logger;
    private clientType;
    constructor(authService: AuthService, usersService: UsersService, logger: Logger);
    login(req: Request, authDto: AuthDto): Promise<import("../common/response-handler/response-handler").ResponseHandlerInterface | undefined>;
    loginWithGoogle(req: Request, createUserDto: CreateGoogleUserDto): Promise<import("../common/response-handler/response-handler").ResponseHandlerInterface | undefined>;
    getCurrentUser(req: Request): Promise<import("../common/response-handler/response-handler").ResponseHandlerInterface | undefined>;
    logout(req: Request, res: Response): import("../common/response-handler/response-handler").ResponseHandlerInterface | undefined;
    getNewtoken(req: Request, res: Response): Promise<import("../common/response-handler/response-handler").ResponseHandlerInterface | undefined>;
}
