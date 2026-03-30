import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseServices } from './course-services';
import { CourseControllers } from './course-controllers';
import { AuthModule } from 'src/auth/auth-module';
import { Course, CourseSchema } from './schema/course-schema';
import { UsersModule } from 'src/user/users-module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    UsersModule,
    AuthModule,
  ],
  providers: [CourseServices],
  controllers: [CourseControllers],
  exports: [CourseServices], // Export CourseServices to use in other modules
})
export class CourseModule {}
