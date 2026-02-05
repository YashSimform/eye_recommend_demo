import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { MfaMethodEnum, MfaStatusEnum } from '@prisma/client';
import { handleError } from '../../common/utils';
import { ResponseResult } from '../../core/class';
import { PrismaService } from '../../database/prisma.service';
import { EnableMfaDto, VerifyMfaDto } from './dtos';
import { MfaRepository } from './mfa.repository';

@Injectable()
export class MfaService {
  constructor(
    private readonly mfaRepository: MfaRepository,
    private readonly prisma: PrismaService,
  ) {}

  async enableMfa(userId: bigint, enableMfaDto: EnableMfaDto) {
    try {
      const { mfa_method, phone_number } = enableMfaDto;

      // Check if user is super administrator
      const isSuperAdmin = await this.isSuperAdministrator(userId);
      if (!isSuperAdmin) {
        throw new BadRequestException('Only SuperAdministrator can enable MFA');
      }

      let secretKey: string | null = null;
      let otpCode: string | null = null;
      if (mfa_method === MfaMethodEnum.authenticator_app) {
        secretKey = this.generateSecret();
      } else if (mfa_method === MfaMethodEnum.email_otp || mfa_method === MfaMethodEnum.sms_otp) {
        otpCode = this.generateOtp();
      }

      const mfaData = await this.mfaRepository.createMfaMethod({
        user: { connect: { user_id: userId } },
        mfa_method,
        phone_number: mfa_method === MfaMethodEnum.sms_otp ? phone_number : null,
        secret_key: secretKey,
        is_enabled: false,
        updated_at: new Date(),
      });

      // Log OTP send event
      if (otpCode) {
        await this.mfaRepository.createMfaLog({
          user: { connect: { user_id: userId } },
          mfa_method,
          otp_code: otpCode,
          status: MfaStatusEnum.pending,
          expires_at: new Date(Date.now() + 10 * 60 * 1000),
        });
      }

      return new ResponseResult({
        message: 'MFA method created, pending verification',
        statusCode: HttpStatus.CREATED,
        data: {
          mfa_id: mfaData.mfa_id.toString(),
          mfa_method: mfaData.mfa_method,
          secret_key: secretKey,
        },
      });
    } catch (error) {
      handleError(error);
    }
  }

  async verifyMfa(userId: bigint, verifyMfaDto: VerifyMfaDto) {
    try {
      const { otp_code } = verifyMfaDto;

      const pendingLog = await this.prisma.userMfaLog.findFirst({
        where: {
          user_id: userId,
          otp_code,
          status: MfaStatusEnum.pending,
          expires_at: { gte: new Date() },
        },
        orderBy: { attempted_at: 'desc' },
      });

      if (!pendingLog) {
        throw new BadRequestException('Invalid or expired OTP');
      }

      // Get the MFA method
      const mfaMethod = await this.prisma.userMfa.findFirst({
        where: {
          user_id: userId,
          mfa_method: pendingLog.mfa_method,
        },
      });

      if (!mfaMethod) {
        throw new NotFoundException('MFA method not found');
      }

      // Enable MFA method
      await this.mfaRepository.updateMfaMethod(mfaMethod.mfa_id, {
        is_enabled: true,
      });

      // Update pending log to verified
      await this.prisma.userMfaLog.update({
        where: { log_id: pendingLog.log_id },
        data: { status: MfaStatusEnum.verified },
      });

      return new ResponseResult({
        message: 'MFA method verified and enabled',
        statusCode: HttpStatus.OK,
        data: { mfa_id: mfaMethod.mfa_id.toString() },
      });
    } catch (error) {
      handleError(error);
    }
  }

  async disableMfa(userId: bigint, mfaId: bigint) {
    try {
      const mfaMethod = await this.mfaRepository.getMfaMethodById(mfaId);
      if (!mfaMethod || mfaMethod.user_id !== userId) {
        throw new NotFoundException('MFA method not found');
      }

      await this.mfaRepository.deleteMfaMethod(mfaId);

      return new ResponseResult({
        message: 'MFA method disabled',
        statusCode: HttpStatus.OK,
        data: null,
      });
    } catch (error) {
      handleError(error);
    }
  }

  async getUserMfaMethods(userId: bigint) {
    try {
      const mfaMethods = await this.mfaRepository.getUserMfaMethods(userId);
      return new ResponseResult({
        message: 'MFA methods retrieved',
        statusCode: HttpStatus.OK,
        data: mfaMethods.map(m => ({
          mfa_id: m.mfa_id.toString(),
          mfa_method: m.mfa_method,
          is_enabled: m.is_enabled,
          created_at: m.created_at,
        })),
      });
    } catch (error) {
      handleError(error);
    }
  }

  async getMfaLogs(userId: bigint) {
    try {
      const logs = await this.mfaRepository.getMfaLogs(userId);
      return new ResponseResult({
        message: 'MFA logs retrieved',
        statusCode: HttpStatus.OK,
        data: logs.map(log => ({
          ...log,
          log_id: log.log_id.toString(),
          user_id: log.user_id.toString(),
        })),
      });
    } catch (error) {
      handleError(error);
    }
  }

  private async isSuperAdministrator(userId: bigint): Promise<boolean> {
    const userRole = await this.prisma.userRole.findFirst({
      where: {
        user_id: userId,
        role: {
          role_name: 'SuperAdministrator',
        },
        is_active: true,
      },
      include: { role: true },
    });

    return !!userRole;
  }

  private generateSecret(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async verifyOtp(
    method: MfaMethodEnum,
    otp: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    secret?: string | null,
  ): Promise<boolean> {
    // Implement OTP verification logic based on method
    // This is a placeholder - implement your actual OTP logic
    switch (method) {
      case MfaMethodEnum.email_otp:
      case MfaMethodEnum.sms_otp:
        // Verify against stored OTP
        return otp.length === 6 && /^\d+$/.test(otp);
      case MfaMethodEnum.authenticator_app:
        // Verify TOTP
        return otp.length === 6 && /^\d+$/.test(otp);
      default:
        return false;
    }
  }
}
