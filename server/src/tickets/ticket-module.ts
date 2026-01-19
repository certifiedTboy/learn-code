import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './schema/ticket-schema';
import { TicketControllers } from './ticket-controllers';
import { TicketServices } from './ticket-services';
import { AuthGuard } from '../guard/auth-guard';
import { ActivityLogModule } from 'src/activity-logs/activitylog-module';
import { AdminRoleGuard } from 'src/guard/admin-role-guard';
import { MailersModule } from 'src/common/mailer/mailers.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    ActivityLogModule,
    MailersModule,
  ],
  controllers: [TicketControllers],
  providers: [TicketServices, AuthGuard, AdminRoleGuard],
  exports: [TicketServices],
})
export class TicketModule {}
