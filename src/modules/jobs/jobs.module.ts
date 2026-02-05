import { Module } from '@nestjs/common';
import { LoggerService } from 'src/common/services/logger.service';
import { NotificationModule } from '../notification/notification.module';
import { JobsService } from './jobs.service';

@Module({
  imports: [NotificationModule],
  providers: [JobsService, LoggerService],
  exports: [JobsService],
})
export class JobsModule {}
