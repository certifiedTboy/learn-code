import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '../guard/auth-guard';
import { Request } from 'express';
import { InternalServerErrorException } from '@nestjs/common';
import { ResponseHandler } from '../common/response-handler/response-handler';
import { ActivityLogServices } from './activitylog-services';

/**
 * @class ActivityControllers
 * @description Handle all activity log-related HTTP requests.
 * @version 1.0
 * @path /api/v1/activity-logs
 */
@Controller({
  path: 'activity-logs',
  version: '1',
})
export class ActivityControllers {
  constructor(private readonly activityLogServices: ActivityLogServices) {}
  /**
   * @method getUserActivityLogs
   * @description handle activity log retrieval.
   */
  @Get(':companyName')
  @UseGuards(AuthGuard)
  async getUserActivityLogs(@Req() req: Request) {
    const companyName = req?.params?.companyName;
    try {
      const activityLogs = await this.activityLogServices.viewAllActivityLogs(
        companyName,
        parseInt(req.query.page as string) || 1,
        parseInt(req.query.limit as string) || 10,
      );

      return ResponseHandler.ok(
        200,
        'Activity logs retrieved successfully',
        activityLogs,
      );
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
}
