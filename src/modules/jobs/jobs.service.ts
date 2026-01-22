import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from 'src/common/services/logger.service';

@Injectable()
export class JobsService {
  constructor(private readonly logger: LoggerService) {}

  // Runs every minute by default. Adjust expression as needed.
  @Cron(CronExpression.EVERY_12_HOURS)
  handleEveryMinute() {
    this.logger.log('JobsService: running scheduled job (every minute)');
    // Put background job logic here (cleanup, send reports, enqueue tasks, etc.)
  }
}
