import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityLog, ActivityLogSchema } from './schemas/activity-logs-schema';
import { ActivityControllers } from './activitylog-controllers';
import { ActivityLogServices } from './activitylog-services';
import { AuthGuard } from '../guard/auth-guard';
import { AdminRoleGuard } from 'src/guard/admin-role-guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivityLog.name, schema: ActivityLogSchema },
    ]),
  ],
  controllers: [ActivityControllers],
  providers: [ActivityLogServices, AuthGuard, AdminRoleGuard],
  exports: [ActivityLogServices], // Export ActivityLogServices to use in other modules
})
export class ActivityLogModule {}
