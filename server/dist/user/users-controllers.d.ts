import { Request } from 'express';
import { Logger } from 'winston';
import { UsersService } from './users-service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { UpdateUserProfileDTO } from './dto/update-user-profile.dto';
import { GenerateNewTokenDto } from './dto/generate-token.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
export declare class UsersController {
    private readonly usersService;
    private readonly logger;
    private clientType;
    constructor(usersService: UsersService, logger: Logger);
    getAllUsers(req: Request): Promise<import("../common/response-handler/response-handler").ResponseHandlerInterface>;
    createUser(createUserDto: CreateUserDto, req: Request): Promise<import("../common/response-handler/response-handler").ResponseHandlerInterface>;
    verifyUser(req: Request, verifyUserDto: VerifyUserDto): Promise<import("../common/response-handler/response-handler").ResponseHandlerInterface>;
    getCurrentUser(req: Request): Promise<import("../common/response-handler/response-handler").ResponseHandlerInterface>;
    updateUserProfile(req: Request, updateUserProfileDto: UpdateUserProfileDTO): Promise<import("../common/response-handler/response-handler").ResponseHandlerInterface>;
    generateNewVerificationCode(req: Request, generateNewTokenDto: GenerateNewTokenDto): Promise<import("../common/response-handler/response-handler").ResponseHandlerInterface>;
    requestPasscodeReset(req: Request, passcodeResetDto: GenerateNewTokenDto): Promise<import("../common/response-handler/response-handler").ResponseHandlerInterface>;
    updatePassword(req: Request, updatePasswordDto: UpdatePasswordDto): Promise<import("../common/response-handler/response-handler").ResponseHandlerInterface>;
}
