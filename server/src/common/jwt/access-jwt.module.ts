import { Module, Global } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessJwtService } from './access-jwt.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        global: true,
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn:
            Number(configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN')),
        },
      }),

      inject: [ConfigService],
    }),
  ],
  providers: [AccessJwtService],
  exports: [AccessJwtService],
})
export class AccessJWTModule {}
