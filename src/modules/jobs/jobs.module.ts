import { Module } from '@nestjs/common';
import { LoggerService } from 'src/common/services/logger.service';
import { JobsService } from './jobs.service';

@Module({
  providers: [JobsService, LoggerService],
  exports: [JobsService],
})
export class JobsModule {}
