import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Model } from 'mongoose';
import { ActivityLogServices } from 'src/activity-logs/activitylog-services';
import { covertToTitleCase } from '../helpers/title-case';
import { TicketDocument, Ticket } from './schema/ticket-schema';
import { EmailService } from 'src/common/mailer/mailer.service';
/**
 * @class TicketServices
 * @description Handles all ticket-related business logic and interactions with the database.
 */
@Injectable()
export class TicketServices {
  constructor(
    @InjectModel(Ticket.name)
    private ticketModel: Model<TicketDocument>,
    private activityLogService: ActivityLogServices,
    private emailService: EmailService,
  ) {}

  /**
   * @method create
   * @description Creates a new user and sends a verification email.
   * @param {CreateTicketDto} createTicketDto - The data transfer object containing ticket details.
   */
  async create(createTicketDto: CreateTicketDto, userId: string) {
    const createdTicket = await this.ticketModel.create({
      ...createTicketDto,
      name: covertToTitleCase(createTicketDto.name),
      user: userId,
    });
    if (!createdTicket) {
      throw new BadRequestException('', {
        cause: 'Ticket creation failed',
        description: 'Ticket creation failed',
      });
    }

    await this.activityLogService.create({
      name: 'New ticket created',
      createdBy: userId,
      createdFor: 'admin',
      description: `A new ticket has been created with the name: ${createTicketDto.name}`,
    });

    await this.emailService.sendTicketCreatedEmail(
      'admin@bravixom.com',
      'New Ticket Created',
      'Admin',
      createTicketDto.status,
    );

    return createdTicket;
  }

  /**
   * @method viewAllTickets
   * @description View all activity logs with pagination
   */
  async viewAllTickets(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const tickets = this.ticketModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('user', 'email firstName lastName companyName phoneNumber');
    return tickets;
  }

  /**
   * @method updateTicketStatus
   * @description update ticket status by id
   */
  async updateTicketStatus(
    ticketId: string,
    status: string,
    companyName: string,
    email: string,
    userId: string,
  ): Promise<TicketDocument> {
    const updatedTicket = await this.ticketModel
      .findByIdAndUpdate(ticketId, { status }, { new: true })
      .populate('user', 'email firstName lastName companyName phoneNumber');

    if (!updatedTicket) {
      throw new BadRequestException('', {
        cause: 'Ticket update failed',
        description: 'Ticket update failed',
      });
    }

    await this.activityLogService.create({
      name: 'Ticket status updated',
      createdBy: userId,
      createdFor: companyName,
      description: `The ticket: ${updatedTicket.name} status has been updated to ${status}`,
    });

    await this.emailService.sendTicketUpdatedEmail(
      email,
      'Ticket Status Updated',
      companyName,
      status,
    );

    return updatedTicket;
  }

  /**
   * @method getTicketsByUserId
   * @description Get all tickets that belongs to a particular user by user id
   */
  async getTicketsByUserId(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const tickets = await this.ticketModel
      .find({ user: userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('user', 'email firstName lastName companyName phoneNumber');

    return tickets;
  }
}
