import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessJwtService } from '../common/jwt/access-jwt.service';

// Define a UserPayload interface that includes _id, email, and phoneNumber
interface AdminPayload {
  _id: string; // Optional, as it may not be used in all cases
  email: string;
  phoneNumber: string;
}

// Extend Express Request interface to include 'user'
declare module 'express' {
  interface Request {
    admin: AdminPayload;
  }
}

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly jwtService: AccessJwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const accessToken = request.cookies['accessToken'];

    if (!accessToken) {
      throw new UnauthorizedException('jwt expired', {
        cause: 'Unauthorized access',
        description: 'Unauthorized access',
      });
    }

    if (accessToken) {
      const payload = await this.jwtService.verifyToken(accessToken);

      if (payload.role !== 'admin') {
        throw new UnauthorizedException('Admin access required', {
          cause: 'Admin access required',
          description: 'Admin access required',
        });
      }

      request.admin = {
        _id: payload._id, // Assuming sub is the user ID
        email: payload.email,
        phoneNumber: payload.sub,
      }; // Assign the user data to the request object

      return true;
    } else {
      return false;
    }
  }
}
