import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PasscodeHashing } from '../helpers/passcode-hashing';
import { UsersService } from '../user/users-service';
import { AccessJwtService } from '../common/jwt/access-jwt.service';
import { RefreshJwtService } from 'src/common/jwt/refresh-jwt-service';
import { CreateGoogleUserDto } from 'src/user/dto/create-user.dto';

/**
 * @class AuthService
 * @description Handles authentication-related operations.
 * This includes signing in users and verifying JWT tokens.
 * @version 1.0
 * @path /api/v1/auth
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly accessJwtService: AccessJwtService,
    private readonly refreshJwtService: RefreshJwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * @method signIn
   * @description Handles user sign-in operations.
   * Validates the input data and checks if the user exists.
   * If valid, generates a JWT token for the user.
   * @param {string} password - The user's password.
   * @param {string} email - The user's email address.
   * @param {string} clientType - The source of the request
   */
  async signIn(password: string, email: string, _clientType: string) {
    const user = await this.usersService.checkIfUserExist({ email });

    if (!user) {
      throw new UnauthorizedException('', {
        cause: 'Invalid login credentials',
        description: 'No user with this email exists',
      });
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('', {
        cause: `Unverified account`,
        description: 'Account is unverified.',
      });
    }

    // if (user?.role === 'user' && clientType === 'web') {
    //   throw new UnauthorizedException('', {
    //     cause: 'Not authorized',
    //     description: 'Not authorized',
    //   });
    // }

    if (!user.password) {
      throw new UnauthorizedException('', {
        cause: 'Request password reset',
        description: 'Request password reset',
      });
    }
    if (user && user.isVerified) {
      const passwordMatch = await PasscodeHashing.verifyPassword(
        password,
        user.password,
      );

      if (!passwordMatch) {
        throw new UnauthorizedException('', {
          cause: `Invalid login credentials`,
          description: 'Invalid login credentials',
        });
      }

      const payload = {
        email: user.email,
        _id: user._id.toString(),
        role: user.role,
        sub: user.email,
      };

      return {
        accessToken: await this.accessJwtService.signToken(payload),
        refreshToken: await this.refreshJwtService.signToken(payload),
        user,
      };
    }
  }

  /**
   * @method googleSignin
   * @description Handles user sign-in operation with google oauth.
   * @param {CreateGoogleUserDto} createUserDto - The data transfer object containing user credentials.
   */
  async googleSignin(createUserDto: CreateGoogleUserDto) {
    const user = await this.usersService.createGoogleUser(createUserDto);

    if (user && user.isVerified) {
      const payload = {
        email: user.email,
        _id: user._id.toString(),
        role: user.role,
        sub: user.email,
      };

      return {
        accessToken: await this.accessJwtService.signToken(payload),
        refreshToken: await this.refreshJwtService.signToken(payload),
        user,
      };
    }
  }

  async googleAdminSignin(idToken: string) {
    const clientId = this.configService.get<string>('EMAIL_CLIENT_ID');
    if (!clientId) {
      throw new InternalServerErrorException(
        'Google sign-in is not configured',
      );
    }

    const response = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );

    const userData: CreateGoogleUserDto = {
      firstName: response?.data?.given_name,
      lastName: response?.data?.family_name,
      email: response?.data?.email,
      profilePicture: response?.data?.picture,
    };

    const user = await this.usersService.createGoogleUser(userData);

    const tokenPayload = {
      email: user.email,
      _id: user._id.toString(),
      role: user.role,
      sub: user.email,
    };

    return {
      accessToken: await this.accessJwtService.signToken(tokenPayload),
      refreshToken: await this.refreshJwtService.signToken(tokenPayload),
      user,
    };
  }

  /**
   * @method generateNewToken
   * @description Generates a new access JWT token for the user.
   * @param {string} refreshToken - The user's refresh token.
   */
  async generateNewToken(refreshToken: string) {
    const { email } = await this.refreshJwtService.verifyToken(refreshToken);

    const userData = await this.usersService.checkIfUserExist({ email });

    if (!userData) {
      throw new UnauthorizedException('', {
        cause: `Invalid token`,
        description: 'User with this email does not exist',
      });
    }

    const payload = {
      email: userData.email,
      _id: userData._id.toString(),
      role: userData.role,
      sub: userData.email,
    };

    return {
      accessToken: await this.accessJwtService.signToken(payload),
      user: userData,
    };
  }
}
