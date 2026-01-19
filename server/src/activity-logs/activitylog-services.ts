import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ActivityLogDto } from './dto/activity-logs.dto';
import { Model } from 'mongoose';
import {
  ActivityLog,
  ActivityLogDocument,
} from './schemas/activity-logs-schema';

/**
 * @class AcitivityLogServices
 * @description Handles all activity log-related business logic and interactions with the database.
 */
@Injectable()
export class ActivityLogServices {
  constructor(
    @InjectModel(ActivityLog.name)
    private activityLogModel: Model<ActivityLogDocument>,
  ) {}

  /**
   * @method create
   * @description Creates a new user and sends a verification email.
   * @param {ActivityLogDto} activityLogDto - The data transfer object containing activity log details.
   */
  async create(activityLogDto: ActivityLogDto) {
    const createdActivityLog = await this.activityLogModel.create({
      ...activityLogDto,
      createdFor: activityLogDto.createdFor,
    });
    if (!createdActivityLog) {
      throw new BadRequestException('', {
        cause: 'Activity log creation failed',
        description: 'Activity log creation failed',
      });
    }

    return createdActivityLog;
  }

  /**
   * @method viewAllActivityLogs
   * @description View all activity logs with pagination
   */
  async viewAllActivityLogs(companyName: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const activityLogs = this.activityLogModel
      .find({ createdFor: companyName })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate(
        'createdBy',
        '-password -verificationToken -passwordResetToken -passwordResetExpiresIn -__v',
      );
    return activityLogs;
  }
}
