import {
  BadRequestException,
  ConflictException,
  // HttpStatus,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserStatusEnum } from '@prisma/client';
import { Response } from 'express';
import { compareHash, handleError } from '../../common/utils';
import { ResponseResult } from '../../core/class/';
import { PrismaService } from '../../database/prisma.service';
import { RoleService } from '../role/role.service';
import { UserRepository } from '../user/user.repository';
import {
  // ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
  SignupDto,
} from './dtos';
import { ICookieConfig, ITokenPayload, IUserValidationResult } from './interfaces';
import { ERROR_MSG, SUCCESS_MSG } from './messages';
import { PasswordResetTokenService } from '../password-reset-token/password-reset-token.service';

@Injectable()
export class AuthService {
  private readonly accessTokenSecretKey: string;
  private readonly refreshTokenSecretKey: string;
  private readonly accessTokenExpire: number | string;
  private readonly refreshTokenExpire: number | string;
  private readonly auth0Domain?: string;
  private readonly auth0ClientId?: string;
  private readonly auth0ClientSecret?: string;
  private readonly auth0Audience?: string;
  private readonly auth0Connection?: string;
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
    private readonly prisma: PrismaService,
    private readonly passwordResetTokenService: PasswordResetTokenService,
  ) {
    this.accessTokenSecretKey = this.configService.get<string>('jwt.accessToken.secretKey');
    this.refreshTokenSecretKey = this.configService.get<string>('jwt.refreshToken.secretKey');
    this.accessTokenExpire = this.configService.get<number | string>('jwt.accessToken.expire');
    this.refreshTokenExpire = this.configService.get<number | string>('jwt.refreshToken.expire');
    this.auth0Domain = this.configService.get<string>('auth0.domain');
    this.auth0ClientId = this.configService.get<string>('auth0.clientId');
    this.auth0ClientSecret = this.configService.get<string>('auth0.clientSecret');
    this.auth0Audience = this.configService.get<string>('auth0.audience');
    this.auth0Connection = this.configService.get<string>('auth0.connection');
  }

  private getAuth0BaseUrl(): string {
    if (!this.auth0Domain) {
      return '';
    }
    return this.auth0Domain.startsWith('http') ? this.auth0Domain : `https://${this.auth0Domain}`;
  }

  private ensureAuth0Configured(): void {
    if (
      !this.auth0Domain ||
      !this.auth0ClientId ||
      !this.auth0ClientSecret ||
      !this.auth0Connection
    ) {
      throw new UnprocessableEntityException(ERROR_MSG.AUTH0.NOT_CONFIGURED);
    }
  }

  private setTokenCookies(res: Response, accessToken: string, refreshToken: string): void {
    const cookieConfig: Omit<ICookieConfig, 'maxAge'> = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    // Set access token cookie
    res.cookie('access_token', accessToken, {
      ...cookieConfig,
      maxAge: this.getTokenExpiry(this.accessTokenExpire),
    });

    // Set refresh token cookie
    res.cookie('refresh_token', refreshToken, {
      ...cookieConfig,
      maxAge: this.getTokenExpiry(this.refreshTokenExpire),
    });
  }

  private getTokenExpiry(expire: string | number): number {
    if (typeof expire === 'number') return expire * 1000;

    // Parse string like "15m", "7d", etc.
    const unit = expire.slice(-1);
    const value = parseInt(expire.slice(0, -1));

    switch (unit) {
      case 'm':
        return value * 60 * 1000; // minutes
      case 'h':
        return value * 60 * 60 * 1000; // hours
      case 'd':
        return value * 24 * 60 * 60 * 1000; // days
      default:
        return 15 * 60 * 1000; // default 15 minutes
    }
  }

  async validateUserBeforeCreate({ email }: Partial<SignupDto>) {
    // Check user exists with same email
    const isEmailRegistered = await this.userRepository.findOneByCondition({
      email,
    });
    if (isEmailRegistered) {
      throw new ConflictException(ERROR_MSG.USER.USER_EXISTS_WITH_SAME_EMAIL);
    }
  }

  async login(data: LoginDto) {
    try {
      const { email, password } = data;

      const isUserFound = await this.userRepository.findOneByCondition({
        email,
      });

      // check user exists or not
      const isPasswordValid =
        isUserFound && (await compareHash(password, isUserFound.password_hash));

      if (!isPasswordValid) {
        throw new BadRequestException(ERROR_MSG.INVALID_CREDENTIALS);
      }

      if (isUserFound.status !== UserStatusEnum.active) {
        throw new UnprocessableEntityException(ERROR_MSG.USER.ACCOUNT_NOT_ACTIVE);
      }

      const accessToken = await this.jwtService.signAsync(
        {
          userId: isUserFound.user_id.toString(),
        },
        {
          secret: this.accessTokenSecretKey,
          expiresIn: this.getTokenExpiry(this.accessTokenExpire),
        },
      );

      const refreshToken = await this.jwtService.signAsync(
        {
          userId: isUserFound.user_id.toString(),
        },
        {
          secret: this.refreshTokenSecretKey,
          expiresIn: this.getTokenExpiry(this.refreshTokenExpire),
        },
      );

      const userInfoRaw = await this.userRepository.findUserById(isUserFound.user_id, {
        user_id: true,
        email: true,
        username: true,
        first_name: true,
        last_name: true,
      });

      const userInfo = {
        ...userInfoRaw,
        user_id: userInfoRaw.user_id.toString(),
      };

      // check user role
      const userRoles = await this.roleService.getUserRoles(isUserFound.user_id);

      // Convert BigInt values to strings
      const userRolesFormatted = userRoles.map(ur => ({
        user_role_id: ur.user_role_id.toString(),
        user_id: ur.user_id.toString(),
        role_id: ur.role_id.toString(),
        assigned_by: ur.assigned_by?.toString(),
        is_active: ur.is_active,
        assigned_at: ur.assigned_at,
        role: {
          role_id: ur.role.role_id.toString(),
          role_name: ur.role.role_name,
          display_name: ur.role.display_name,
          description: ur.role.description,
          is_system_role: ur.role.is_system_role,
          is_active: ur.role.is_active,
          permissions: ur.role.permissions,
          priority: ur.role.priority,
          created_by: ur.role.created_by?.toString(),
          updated_by: ur.role.updated_by?.toString(),
          created_at: ur.role.created_at,
          updated_at: ur.role.updated_at,
        },
      }));

      return new ResponseResult({
        message: SUCCESS_MSG.USER.LOGIN,
        data: {
          userInfo,
          userRoles: userRolesFormatted,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      handleError(error);
    }
  }

  async refreshToken(refreshToken: string, res: Response) {
    try {
      if (!refreshToken) {
        throw new UnauthorizedException(ERROR_MSG.UNAUTHORIZED);
      }

      const tokenData = await this.jwtService.verifyAsync<ITokenPayload>(refreshToken, {
        secret: this.refreshTokenSecretKey,
      });

      if (!tokenData?.userId) {
        throw new UnauthorizedException(ERROR_MSG.UNAUTHORIZED);
      }

      const userInfo = await this.userRepository.findUserById(tokenData.userId);

      if (userInfo?.status !== UserStatusEnum.active) {
        throw new UnauthorizedException(ERROR_MSG.USER.ACCOUNT_NOT_ACTIVE);
      }

      const accessToken = await this.jwtService.signAsync(
        {
          userId: userInfo.user_id.toString(),
        },
        {
          secret: this.accessTokenSecretKey,
          expiresIn: this.getTokenExpiry(this.accessTokenExpire),
        },
      );
      const newRefreshToken = await this.jwtService.signAsync(
        {
          userId: userInfo.user_id.toString(),
        },
        {
          secret: this.refreshTokenSecretKey,
          expiresIn: this.getTokenExpiry(this.refreshTokenExpire),
        },
      );

      // Set new tokens in cookies
      this.setTokenCookies(res, accessToken, newRefreshToken);

      return new ResponseResult<null>({
        message: SUCCESS_MSG.USER.REFRESH_TOKEN,
        data: null,
      });
    } catch (error) {
      if (
        error?.name === 'TokenExpiredError' ||
        error?.name === 'JsonWebTokenError' ||
        (error?.message && error?.message === 'jwt expired')
      ) {
        handleError(new UnauthorizedException(ERROR_MSG.TOKEN_EXPIRED));
      }
      handleError(error);
    }
  }

  async logout(res: Response) {
    try {
      // Clear cookies
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');

      return new ResponseResult<null>({
        message: SUCCESS_MSG.USER.LOGOUT,
        data: null,
      });
    } catch (error) {
      handleError(error);
    }
  }

  // async changePassword(userId: string, data: ChangePasswordDto) {
  //   try {
  //     const { newPassword, oldPassword } = data;

  //     const userInfo = await this.userRepository.findUserById(userId, {
  //       password: true,
  //     });

  //     if (newPassword === oldPassword) {
  //       throw new BadRequestException(ERROR_MSG.PASSWORD.SAME_PASSWORD);
  //     }

  //     // check old password
  //     if (!(await compareHash(oldPassword, userInfo.password))) {
  //       throw new ConflictException(ERROR_MSG.PASSWORD.INVALID_OLD_PASSWORD);
  //     }

  //     const newPasswordHash = await createHash(newPassword);

  //     await this.userRepository.updateUserById(userId, {
  //       password: newPasswordHash,
  //     });

  //     return new ResponseResult<null>({
  //       message: SUCCESS_MSG.USER.CHANGE_PASSWORD,
  //     });
  //   } catch (error) {
  //     handleError(error);
  //   }
  // }

  async validateAccessToken(token: string): Promise<IUserValidationResult> {
    try {
      // check token
      if (!token) {
        throw new UnauthorizedException(ERROR_MSG.UNAUTHORIZED);
      }

      const decode = await this.jwtService.verifyAsync<ITokenPayload>(token, {
        secret: this.accessTokenSecretKey,
      });

      if (!decode?.userId) {
        throw new UnauthorizedException(ERROR_MSG.UNAUTHORIZED);
      }

      const loginUserInfo = await this.userRepository.findUserById(decode?.userId);

      if (!loginUserInfo) {
        throw new UnauthorizedException(ERROR_MSG.UNAUTHORIZED);
      }

      if (loginUserInfo.status !== UserStatusEnum.active) {
        throw new UnauthorizedException(ERROR_MSG.USER.ACCOUNT_NOT_ACTIVE);
      }

      return {
        userId: loginUserInfo.user_id,
        name: loginUserInfo.username,
      };
    } catch (error) {
      if (
        error?.name === 'TokenExpiredError' ||
        error?.name === 'JsonWebTokenError' ||
        (error?.message && error?.message === 'jwt expired')
      ) {
        handleError(new UnauthorizedException(ERROR_MSG.TOKEN_EXPIRED));
      }
      handleError(error);
    }
  }

  async forgotPassword(data: ForgotPasswordDto) {
    try {
      const { email } = data;

      // Find user by email
      const user = await this.userRepository.findOneByCondition({ email });

      if (!user) {
        throw new BadRequestException(ERROR_MSG.USER.USER_NOT_FOUND);
      }

      // Create reset token using service
      const { token: resetToken } = await this.passwordResetTokenService.createResetToken(
        user.user_id,
        user.email,
      );

      // Create reset link with frontend URL
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

      // TODO: Send email with reset link (SendGrid/Nodemailer)
      // For development, you can log these values
      if (process.env.NODE_ENV !== 'production') {
        // Log for development purposes only
      }

      return new ResponseResult({
        message: SUCCESS_MSG.USER.FORGOT_PASSWORD,
        data: {
          message: 'Password reset link sent to your email',
          // Return link for development testing only
          ...(process.env.NODE_ENV !== 'production' && { resetLink }),
        },
      });
    } catch (error) {
      handleError(error);
    }
  }

  async resetPassword(data: ResetPasswordDto) {
    try {
      const { token, password, confirmPassword } = data;

      // Check if passwords match
      if (password !== confirmPassword) {
        throw new BadRequestException(ERROR_MSG.PASSWORD.PASSWORDS_DO_NOT_MATCH);
      }

      // Validate token and get record
      const resetTokenRecord = await this.passwordResetTokenService.validateAndGetToken(token);

      // Update password and mark token as used
      await this.passwordResetTokenService.updatePasswordAndMarkUsed(
        resetTokenRecord.user_id,
        resetTokenRecord.token_id,
        password,
      );

      return new ResponseResult({
        message: SUCCESS_MSG.USER.RESET_PASSWORD,
        data: {
          message: 'Password reset successfully',
        },
      });
    } catch (error) {
      handleError(error);
    }
  }
}
