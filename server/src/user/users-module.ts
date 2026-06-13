import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users-controllers';
import { UsersService } from './users-service';
import { User, UserSchema } from './schemas/user-schema';
import { AccessJWTModule } from '../common/jwt/access-jwt.module';
import { MailersModule } from '../common/mailer/mailers.module';
import { QueueModule } from '../queue/queue-module';
import { AuthGuard } from '../guard/auth-guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AccessJWTModule,
    MailersModule,
    ConfigModule,
    forwardRef(() => QueueModule), // Use forwardRef to avoid circular dependency
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthGuard],
  exports: [UsersService], // Export UsersService to use in other modules
})
export class UsersModule {}
