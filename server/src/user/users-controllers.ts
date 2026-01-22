import { Controller, Post, Patch, Body, Get } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users-service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { GenerateNewTokenDto } from './dto/generate-token.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResponseHandler } from '../common/response-handler/response-handler';
import { covertToTitleCase } from '../helpers/title-case';

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
  constructor(private readonly usersService: UsersService) {}

  /**
   * @method getAllUsers
   * @description Retrieves all users from the database.
   */
  @Get('')
  // @UseGuards(AuthGuard)
  async getAllUsers() {
    try {
      const result = await this.usersService.findAllUsers();

      return ResponseHandler.ok(
        200,
        'Users retrieved successfully',
        result || [],
      );
    } catch (error) {
      if (error instanceof Error) {
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
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.usersService.create({
        ...createUserDto,
        firstName: covertToTitleCase(createUserDto.firstName),
        lastName: covertToTitleCase(createUserDto.lastName),
      });

      return ResponseHandler.ok(201, 'User created successfully', result || {});
    } catch (error) {
      if (error instanceof Error) {
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
  async verifyUser(@Body() verifyUserDto: VerifyUserDto) {
    try {
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
      console.log(error);
      if (error instanceof Error) {
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
    @Body() generateNewTokenDto: GenerateNewTokenDto,
  ) {
    try {
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
  async requestPasscodeReset(@Body() passcodeResetDto: GenerateNewTokenDto) {
    try {
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
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    try {
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
