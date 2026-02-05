import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationScheduler {
  private readonly logger = new Logger(NotificationScheduler.name);

  constructor(private readonly notificationService: NotificationService) {}

  // Run every minute and process due notifications
  @Cron('12 * * * *')
  async handleCron() {
    try {
      // const processed = await this.notificationService.sendDueNotifications();
      // if (processed > 0) this.logger.log(`Processed ${processed} notification(s)`);
      // console.log("------------------------------------");
    } catch (err) {
      this.logger.error('Error processing notifications', err);
    }
  }
}
