import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { MfaController } from './mfa.controller';
import { MfaRepository } from './mfa.repository';
import { MfaService } from './mfa.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MfaController],
  providers: [MfaService, MfaRepository],
  exports: [MfaService],
})
export class MfaModule {}
