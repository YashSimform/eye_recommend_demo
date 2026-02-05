import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PasswordResetTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createToken(data: Prisma.PasswordResetTokenCreateInput) {
    return this.prisma.passwordResetToken.create({ data });
  }

  async findByToken(token: string) {
    return this.prisma.passwordResetToken.findUnique({
      where: { token },
    });
  }

  async markUsed(tokenId: bigint, usedAt: Date) {
    return this.prisma.passwordResetToken.update({
      where: { token_id: tokenId },
      data: { used_at: usedAt },
    });
  }
}
