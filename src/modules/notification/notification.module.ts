import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { NotificationService } from './notification.service';
import { EmailNotificationProvider, NotificationProvider } from './providers/notification.provider';
import { NotificationController } from './notification.controller';
import { NotificationScheduler } from './notification.scheduler';

@Module({
  imports: [DatabaseModule],
  providers: [
    NotificationService,
    { provide: NotificationProvider, useClass: EmailNotificationProvider },
    NotificationScheduler,
  ],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
