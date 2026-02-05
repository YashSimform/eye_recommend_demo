import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from 'src/common/services/logger.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class JobsService {
  constructor(private readonly logger: LoggerService,
    private readonly notificationService: NotificationService
  ) {}

  // Runs every minute by default. Adjust expression as needed.
  @Cron(CronExpression.EVERY_HOUR)
  async handleEveryMinute() {
    //  await this.notificationService.sendDueNotifications();
    this.logger.log('JobsService: running scheduled job (every minute)');
    // Put background job logic here (cleanup, send reports, enqueue tasks, etc.)
  }
}
