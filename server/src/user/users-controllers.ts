import {
  Controller,
  Post,
  Patch,
  Body,
  Get,
  UseGuards,
  Req,
  Inject,
} from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UsersService } from './users-service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { UpdateUserProfileDTO } from './dto/update-user-profile.dto';
import { GenerateNewTokenDto } from './dto/generate-token.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResponseHandler } from '../common/response-handler/response-handler';
import { AdminGuard, AuthGuard } from '../guard/auth-guard';

/**
 * @class UsersController
 * @description Handles all user-related HTTP requests.
 * This includes creating users and verifying them.
 * @version 1.0
 * @path /api/v1/users
 */
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  private clientType: string = '';
  constructor(
    private readonly usersService: UsersService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  /**
   * @method getAllUsers
   * @description Retrieves all users from the database.
   */
  @Get('')
  @UseGuards(AdminGuard)
  async getAllUsers(@Req() req: Request) {
    try {
      this.clientType = req.headers['x-client-type'] as string;

      this.logger.info({
        level: 'info',
        message: 'Fetching all users',
        clientType: this.clientType,
      });
      const result = await this.usersService.findAllUsersByAdmin();

      return ResponseHandler.ok(
        200,
        'Users retrieved successfully',
        result || [],
      );
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error({
          level: 'error',
          message: error.cause,
          clientType: this.clientType,
        });
        throw new InternalServerErrorException('Something went wrong', {
          cause: error.cause,
          description: error.message,
        });
      }

      throw new InternalServerErrorException('Something went wrong', {
        cause: 'Internal server error',
        description: 'An unexpected error occurred',
      });
    }
  }

  /**
   * @method createUser
   * @description Handles user creation requests.
   * Validates the input data and checks if the user already exists.
   * If not, creates a new user and sends a verification email.
   * @param {CreateUserDto} createUserDto - The data transfer object containing user details.
   */
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    try {
      this.clientType = req.headers['x-client-type'] as string;

      this.logger.info({
        level: 'info',
        message: 'Creating a new user',
        email: createUserDto.email,
        clientType: this.clientType,
      });
      const result = await this.usersService.create(
        createUserDto,
        this.clientType,
      );

      return ResponseHandler.ok(201, 'User created successfully', result || {});
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error({
          level: 'error',
          message: error.cause,
          email: createUserDto.email,
          clientType: this.clientType,
        });
        throw new InternalServerErrorException('Something went wrong', {
          cause: error.cause,
          description: error.message,
        });
      }

      throw new InternalServerErrorException('Something went wrong', {
        cause: 'Internal server error',
        description: 'An unexpected error occurred',
      });
    }
  }

  /**
   * @method verifyUser
   * @description Handles user verification requests.
   * Validates the input data and verifies the user using the provided verification code.
   * @param {VerifyUserDto} verifyUserDto - The data transfer object containing the verification code.
   */
  @Patch('verify')
  async verifyUser(@Req() req: Request, @Body() verifyUserDto: VerifyUserDto) {
    try {
      this.clientType = req.headers['x-client-type'] as string;

      this.logger.info({
        level: 'info',
        message: 'Verifying user',
        clientType: this.clientType,
      });
      const result = await this.usersService.verifyUser(verifyUserDto);

      /**
       * we check if the result still contains the verification code
       * which indicates that the initial verification has exceeded one hour before usage
       * if the verification code is expired, a new one is generated and returned with result and also sent to the user as an email
       */
      if (result?.verificationCode) {
        return ResponseHandler.ok(200, `verification code updated`, result);
      }

      return ResponseHandler.ok(200, 'User verified successfully', result!);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error({
          level: 'error',
          message: error.cause,
          clientType: this.clientType,
        });
        throw new InternalServerErrorException('Something went wrong', {
          cause: error.cause,
          description: error.message,
        });
      }

      throw new InternalServerErrorException('Something went wrong', {
        cause: 'Internal server error',
        description: 'An unexpected error occurred',
      });
    }
  }

  /**
   * @method getCurrentUser
   * @description Retrieves the currently authenticated user's information.
   * This endpoint is protected by the AuthGuard, which ensures that only authenticated users can access it.
   * @param {Request} req - The HTTP request object containing user information.
   * @returns {Promise<ResponseHandler>} - A response handler containing the current user's information.
   */
  @Get('current-user')
  @UseGuards(AuthGuard)
  async getCurrentUser(@Req() req: Request) {
    try {
      const { email } = req.user;

      this.clientType = req.headers['x-client-type'] as string;

      this.logger.info({
        level: 'info',
        message: 'Fetching current user',
        email,
        clientType: this.clientType,
      });
      // console.log(req.user);
      const user = await this.usersService.checkIfUserExist({
        email,
      });

      // cosole.log('Current user:', user);
      return ResponseHandler.ok(
        200,
        'Current user retrieved successfully',
        user!,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error({
          level: 'error',
          message: error.cause,
          email: req.user?.email,
          clientType: this.clientType,
        });
        throw new InternalServerErrorException('Something went wrong', {
          cause: error.cause,
          description: error.message,
        });
      }

      throw new InternalServerErrorException('Something went wrong', {
        cause: 'Internal server error',
        description: 'An unexpected error occurred',
      });
    }
  }

  /**
   * @method updateUserProfile
   * @description updates the users firstName and lastName
   */
  @Patch('current-user/update')
  @UseGuards(AuthGuard)
  async updateUserProfile(
    @Req() req: Request,
    @Body() updateUserProfileDto: UpdateUserProfileDTO,
  ) {
    try {
      this.clientType = req.headers['x-client-type'] as string;

      this.logger.info({
        level: 'info',
        message: 'Updating user profile',
        clientType: this.clientType,
      });
      const result = await this.usersService.updateProfile(
        req?.user?._id,
        updateUserProfileDto,
      );

      return ResponseHandler.ok(200, 'Profile updated successfully', result);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error({
          level: 'error',
          message: error.cause,
          clientType: this.clientType,
        });
        throw new InternalServerErrorException('Something went wrong', {
          cause: error.cause,
          description: error.message,
        });
      }

      throw new InternalServerErrorException('Something went wrong', {
        cause: 'Internal server error',
        description: 'An unexpected error occurred',
      });
    }
  }

  /**
   * @method generateNewVerificationCode
   * @description Handles requests to generate a new verification code for the user.
   * Validates the input data and checks if the user exists.
   * If valid, generates a new verification code and sends it to the user.
   * @param {GenerateNewTokenDto} generateNewTokenDto - The email of the user for whom the verification code is to be generated.
   * @throws {Error} - Throws an error if the code generation process fails.
   */
  @Post('new-verification-code')
  async generateNewVerificationCode(
    @Req() req: Request,
    @Body() generateNewTokenDto: GenerateNewTokenDto,
  ) {
    try {
      this.clientType = req.headers['x-client-type'] as string;

      this.logger.info({
        level: 'info',
        message: 'Generating new verification code',
        email: generateNewTokenDto.email,
        clientType: this.clientType,
      });
      const { email } = generateNewTokenDto;

      if (!email) {
        throw new BadRequestException('', {
          cause: 'Email is required',
          description: 'Please provide a valid email address',
        });
      }

      const updatedUser = await this.usersService.newVerificationCode(email);

      if (!updatedUser) {
        throw new BadRequestException('', {
          cause: 'User not found',
          description: 'No user found with the provided email address',
        });
      }

      // Send the verification code via email
      return ResponseHandler.ok(201, 'New Verification code sent', updatedUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error({
          level: 'error',
          message: error.cause,
          email: generateNewTokenDto.email,
          clientType: this.clientType,
        });
        throw new InternalServerErrorException('', {
          cause: error.cause,
          description: error.message,
        });
      }
      throw new InternalServerErrorException('Something went wrong', {
        cause: 'Internal server error',
        description: 'An unexpected error occurred',
      });
    }
  }

  /**
   * @method requestPassCodeReset
   * @description Handles requests to generate a passcode reset link for the user.
   * Validates the input data and checks if the user exists.
   * If valid, generates a passcode reset link and sends it to the user's email.
   * @param {GenerateNewTokenDto} passcodeResetDto - The data transfer object containing user credentials.
   * @throws {Error} - Throws an error if the passcode reset link generation process fails.
   */
  @Post('password/reset')
  async requestPasscodeReset(
    @Req() req: Request,
    @Body() passcodeResetDto: GenerateNewTokenDto,
  ) {
    try {
      this.clientType = req.headers['x-client-type'] as string;

      this.logger.info({
        level: 'info',
        message: 'Requesting password reset code',
        email: passcodeResetDto.email,
        clientType: this.clientType,
      });
      const { email } = passcodeResetDto;

      if (!email) {
        throw new BadRequestException('', {
          cause: 'Email is required',
          description: 'Email is required',
        });
      }

      const user = await this.usersService.getResetPasswordCode(email);

      return ResponseHandler.ok(200, 'Password reset code sent', {
        email: user?.email,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error({
          level: 'error',
          message: error.cause,
          email: passcodeResetDto.email,
          clientType: this.clientType,
        });
        throw new InternalServerErrorException('', {
          cause: error.cause,
          description: error.message,
        });
      }

      throw new InternalServerErrorException('Something went wrong', {
        cause: 'Internal server error',
        description: 'An unexpected error occurred',
      });
    }
  }

  /**
   * @method UpdatePassword
   * @description Handles requests to update the user's passcode.
   * Validates the input data and checks if the user exists.
   * If valid, updates the user's passcode and returns the updated user object.
   * @param {UpdatePasswordDto} updatePasswordDto - The data transfer object containing the new passcode and reset token.
   * @throws {Error} - Throws an error if the passcode update process fails.
   */
  @Patch('password/reset/update')
  async updatePassword(
    @Req() req: Request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    try {
      this.clientType = req.headers['x-client-type'] as string;

      this.logger.info({
        level: 'info',
        message: 'Updating user password',
        clientType: this.clientType,
      });

      const { password, passwordResetCode } = updatePasswordDto;

      if (!password || !passwordResetCode) {
        throw new BadRequestException('', {
          cause: 'Password and password reset code are required',
          description:
            'Please provide a valid password and password reset code',
        });
      }

      if (password !== updatePasswordDto.confirmPassword) {
        throw new BadRequestException('', {
          cause: 'Passwords do not match',
          description: 'Passwords do not match',
        });
      }

      const updatedUser =
        await this.usersService.updateUserPassword(updatePasswordDto);

      if (!updatedUser) {
        throw new BadRequestException('', {
          cause: 'passcode update failed',
          description: 'passcode failed to be updated',
        });
      }

      return ResponseHandler.ok(
        200,
        'Passcode updated successfully',
        updatedUser,
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

      throw new InternalServerErrorException('Something went wrong', {
        cause: 'Internal server error',
        description: 'An unexpected error occurred',
      });
    }
  }
}
