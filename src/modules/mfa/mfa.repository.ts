import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MfaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserMfaMethods(userId: bigint) {
    return this.prisma.userMfa.findMany({
      where: { user_id: userId },
    });
  }

  async getMfaMethodById(mfaId: bigint) {
    return this.prisma.userMfa.findUnique({
      where: { mfa_id: mfaId },
    });
  }

  async createMfaMethod(data: Prisma.UserMfaCreateInput) {
    return this.prisma.userMfa.create({ data });
  }

  async updateMfaMethod(mfaId: bigint, data: Prisma.UserMfaUpdateInput) {
    return this.prisma.userMfa.update({
      where: { mfa_id: mfaId },
      data,
    });
  }

  async deleteMfaMethod(mfaId: bigint) {
    return this.prisma.userMfa.delete({
      where: { mfa_id: mfaId },
    });
  }

  async createMfaLog(data: Prisma.UserMfaLogCreateInput) {
    return this.prisma.userMfaLog.create({ data });
  }

  async getMfaLogs(userId: bigint, limit = 10) {
    return this.prisma.userMfaLog.findMany({
      where: { user_id: userId },
      orderBy: { attempted_at: 'desc' },
      take: limit,
    });
  }
}
