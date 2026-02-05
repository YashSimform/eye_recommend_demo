import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PasswordResetTokenRepository } from './password-reset-token.repository';
import { PasswordResetTokenService } from './password-reset-token.service';

@Module({
  imports: [DatabaseModule],
  providers: [PasswordResetTokenService, PasswordResetTokenRepository],
  exports: [PasswordResetTokenService],
})
export class PasswordResetTokenModule {}
