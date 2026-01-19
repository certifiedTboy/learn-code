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
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth-services';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from '../guard/auth-guard';
import { ResponseHandler } from '../common/response-handler/response-handler';
import { UsersService } from '../user/users-service';

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
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * @method login
   * @description Handles user login requests.
   * Validates the input data and checks if the user exists.
   * If valid, generates a JWT token for the user.
   * @param {AuthDto} authDto - The data transfer object containing user credentials.
   */
  @Post('login')
  async login(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { password, email } = authDto;

      const result = await this.authService.signIn(password, email);

      res.cookie('accessToken', result?.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 60 * 60 * 1000 * 24, // 1 day
      });

      return ResponseHandler.ok(200, 'login successful', result);
    } catch (error: unknown) {
      if (error instanceof Error) {
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
    try {
      const currentUser = req.user;

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
      res.clearCookie('accessToken');

      return ResponseHandler.ok(200, 'User logged out successfully', undefined);
    } catch (error: unknown) {
      if (error instanceof Error) {
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
  @Post('new-token')
  async getNewtoken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const refreshToken = req.headers['authorization']?.split(' ')[1];

      if (!refreshToken) {
        throw new BadRequestException('', {
          cause: 'Invalid request',
          description: 'Refresh token is required',
        });
      }
      const result = await this.authService.generateNewToken(refreshToken);

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      return ResponseHandler.ok(
        200,
        'new token generated successfully',
        result,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException('', {
          cause: error.cause,
          description: error.message,
        });
      }
    }
  }
}
