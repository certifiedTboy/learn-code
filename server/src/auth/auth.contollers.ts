import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
  BadRequestException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AuthService } from './auth-services';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from '../guard/auth-guard';
import { ResponseHandler } from '../common/response-handler/response-handler';
import { UsersService } from '../user/users-service';
import { CreateGoogleUserDto } from 'src/user/dto/create-user.dto';

/**
 * @class AuthControllers
 * @description Handles all authentication-related HTTP requests.
 * This includes user login.
 * @version 1.0
 * @path /api/v1/auth
 */
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthControllers {
  private clientType: string = '';
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  /**
   * @method login
   * @description Handles user login requests.
   * Validates the input data and checks if the user exists.
   * If valid, generates a JWT token for the user.
   * @param {AuthDto} authDto - The data transfer object containing user credentials.
   */
  @Post('login')
  async login(@Req() req: Request, @Body() authDto: AuthDto) {
    try {
      const { password, email } = authDto;

      this.clientType = req.headers['x-client-type'] as string;

      this.logger.info({
        level: 'info',
        message: 'Signin in user with email and password',
        email: authDto.email,
        clientType: this.clientType,
      });

      const result = await this.authService.signIn(
        password,
        email,
        this.clientType,
      );

      return ResponseHandler.ok(200, 'login successful', result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error({
          level: 'error',
          message: error.cause,
          email: authDto.email,
          clientType: this.clientType,
        });
        throw new BadRequestException('', {
          cause: error.cause,
          description: error.message,
        });
      }
    }
  }

  /**
   * @method loginWithGoodle
   * @param {GoogleAuthDto} authDto - The data transfer object containing user credentials.
   */
  @Post('google/login')
  async loginWithGoogle(
    @Req() req: Request,
    @Body() createUserDto: CreateGoogleUserDto,
  ) {
    try {
      this.clientType = req.headers['x-client-type'] as string;
      this.logger.info({
        level: 'info',
        message: 'Signin in user with google',
        email: createUserDto.email,
        clientType: this.clientType,
      });
      const result = await this.authService.googleSignin(createUserDto);

      return ResponseHandler.ok(200, 'login successful', result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error({
          level: 'error',
          message: error.cause,
          email: createUserDto.email,
          clientType: this.clientType,
        });
        throw new BadRequestException('', {
          cause: error.cause,
          description: error.message,
        });
      }
    }
  }

  /**
   * @method getCurrentUser
   * @description Handles requests to get the current user's information.
   */
  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@Req() req: Request) {
    const currentUser = req.user as { email: string; _id: string };
    try {
      this.clientType = req.headers['x-client-type'] as string;

      this.logger.info({
        level: 'info',
        message: 'Fetching current user',
        email: currentUser?.email,
        clientType: this.clientType,
      });

      if (!currentUser) {
        throw new BadRequestException('', {
          cause: 'Unauthorized access',
          description: 'User not authenticated',
        });
      }

      const user = await this.usersService.checkUserExistById(currentUser?._id);

      if (user) {
        return ResponseHandler.ok(200, 'User retrieved successfully', user);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error({
          level: 'error',
          message: error.cause,
          email: currentUser?.email,
          clientType: this.clientType,
        });
        throw new InternalServerErrorException('', {
          cause: error.cause,
          description: error.message,
        });
      }
    }
  }

  /**
   * @method logout
   * @description Handles requests to get the current user's information.
   */
  @Get('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      this.clientType = req.headers['x-client-type'] as string;

      this.logger.info({
        level: 'info',
        message: 'User logging out',
        clientType: this.clientType,
      });
      res.clearCookie('accessToken');

      return ResponseHandler.ok(200, 'User logged out successfully', undefined);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error({
          level: 'error',
          message: error.cause,
          clientType: this.clientType,
        });
        throw new InternalServerErrorException('', {
          cause: error.cause,
          description: error.message,
        });
      }
    }
  }

  /**
   * @method getNewToken
   * @description Handles requests to generate a new token for the user.
   * @param {RefreshTokenDto} refreshTokenDto - The data transfer object containing user credentials.
   */
  @Get('new-token')
  async getNewtoken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      this.clientType = req.headers['x-client-type'] as string;

      this.logger.info({
        level: 'info',
        message: 'Generating new token',
        clientType: this.clientType,
      });
      const refreshToken = req.headers['authorization']?.split(' ')[1];

      if (!refreshToken) {
        throw new BadRequestException('', {
          cause: 'Invalid request',
          description: 'Refresh token is required',
        });
      }
      const result = await this.authService.generateNewToken(refreshToken);

      // res.cookie('accessToken', result.accessToken, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: 'none',
      //   maxAge: 60 * 60 * 1000, // 1 hour
      // });

      return ResponseHandler.ok(
        200,
        'new token generated successfully',
        result,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error({
          level: 'error',
          message: error.cause,
          clientType: this.clientType,
        });
        throw new InternalServerErrorException('', {
          cause: error.cause,
          description: error.message,
        });
      }
    }
  }
}
