import {
  Controller,
  Get,
  UseGuards,
  Req,
  Body,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '../guard/auth-guard';
import { Request } from 'express';
import { InternalServerErrorException } from '@nestjs/common';
import { ResponseHandler } from '../common/response-handler/response-handler';
import { TicketServices } from './ticket-services';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AdminRoleGuard } from 'src/guard/admin-role-guard';

/**
 * @class TicketControllers
 * @description Handle all ticket-related HTTP requests.
 * @version 1.0
 * @path /api/v1/tickets
 */
@Controller({
  path: 'tickets',
  version: '1',
})
export class TicketControllers {
  constructor(private readonly ticketServices: TicketServices) {}
  /**
   * @method createTicket
   * @description handle ticket creation.
   */
  @Post('')
  @UseGuards(AuthGuard)
  async createTicket(
    @Body() createTickeDto: CreateTicketDto,
    @Req() req: Request,
  ) {
    try {
      const result = await this.ticketServices.create(
        createTickeDto,
        req.user._id,
      );

      return ResponseHandler.ok(200, 'Ticket created successfully', result);
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
   * @method getAllTickets
   * @description handle ticket retrieval.
   */
  @Get('')
  @UseGuards(AdminRoleGuard)
  async getAllTickets(@Req() req: Request) {
    try {
      const tickets = await this.ticketServices.viewAllTickets(
        parseInt(req.query.page as string) || 1,
        parseInt(req.query.limit as string) || 10,
      );

      return ResponseHandler.ok(200, 'Tickets retrieved successfully', tickets);
    } catch (error) {
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
   * @method getTicketsByUserId
   * @description handle ticket retrieval by user ID.
   */
  @Get('tickets-by-user')
  @UseGuards(AuthGuard)
  async getTicketsByUserId(@Req() req: Request) {
    try {
      const userId = req.user._id;

      const tickets = await this.ticketServices.getTicketsByUserId(
        userId,
        parseInt(req.query.page as string) || 1,
        parseInt(req.query.limit as string) || 10,
      );

      return ResponseHandler.ok(200, 'Tickets retrieved successfully', tickets);
    } catch (error) {
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
   * @method updateTicketStatus
   * @description handle ticket status update.
   */
  @Patch(':ticketId/status/update')
  @UseGuards(AdminRoleGuard)
  async updateTicketStatus(
    @Body() updateTicketDto: UpdateTicketDto,
    @Req() req: Request,
  ) {
    try {
      const ticketId = req.params.ticketId;

      const email = req.admin.email;
      const userId = req.admin._id;

      const { status, companyName } = updateTicketDto;

      const updatedTicket = await this.ticketServices.updateTicketStatus(
        ticketId,
        status,
        companyName,
        email,
        userId,
      );

      return ResponseHandler.ok(
        200,
        'Ticket status updated successfully',
        updatedTicket,
      );
    } catch (error) {
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
