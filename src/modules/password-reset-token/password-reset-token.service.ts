import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { createHash } from '../../common/utils';
import { PrismaService } from '../../database/prisma.service';
import { ERROR_MSG } from '../auth/messages';
import { PasswordResetTokenRepository } from './password-reset-token.repository';

@Injectable()
export class PasswordResetTokenService {
  constructor(
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private getExpiryMinutes(): number {
    const envValue = this.configService.get<string>('PASSWORD_RESET_TOKEN_EXPIRE_MINUTES');
    const parsed = envValue ? Number(envValue) : NaN;
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
    return 60;
  }

  async createResetToken(userId: bigint, _email: string, ipAddress?: string) {
    const token = randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + this.getExpiryMinutes() * 60 * 1000);

    const record = await this.passwordResetTokenRepository.createToken({
      token,
      expires_at: expiresAt,
      ip_address: ipAddress ?? null,
      user: { connect: { user_id: userId } },
    });

    return { token, record };
  }

  async validateAndGetToken(token: string) {
    const resetTokenRecord = await this.passwordResetTokenRepository.findByToken(token);

    if (!resetTokenRecord || resetTokenRecord.used_at) {
      throw new BadRequestException(ERROR_MSG.PASSWORD.RESET_TOKEN_INVALID);
    }

    if (resetTokenRecord.expires_at.getTime() < Date.now()) {
      throw new BadRequestException(ERROR_MSG.PASSWORD.RESET_TOKEN_EXPIRED);
    }

    return resetTokenRecord;
  }

  async updatePasswordAndMarkUsed(userId: bigint, tokenId: bigint, newPassword: string) {
    const passwordHash = await createHash(newPassword);
    const usedAt = new Date();

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { user_id: userId },
        data: { password_hash: passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { token_id: tokenId },
        data: { used_at: usedAt },
      }),
    ]);
  }
}
