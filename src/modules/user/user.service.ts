import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserStatusEnum } from '@prisma/client';
import { createHash, handleError } from '../../common/utils';
import { ResponseResult } from '../../core/class/';
import { CreateUserDto } from './dtos/create-user.dto';
import { SUCCESS_MSG } from './messages';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly accessTokenSecretKey: string;
  private readonly refreshTokenSecretKey: string;
  private readonly accessTokenExpire: number | string;
  private readonly refreshTokenExpire: number | string;
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.accessTokenSecretKey = this.configService.get<string>('jwt.accessToken.secretKey');
    this.refreshTokenSecretKey = this.configService.get<string>('jwt.refreshToken.secretKey');
    this.accessTokenExpire = this.configService.get<number | string>('jwt.accessToken.expire');
    this.refreshTokenExpire = this.configService.get<number | string>('jwt.refreshToken.expire');
  }

  async createUser(data: CreateUserDto, createdBy?: bigint) {
    try {
      const {
        email,
        password_hash,
        username,
        first_name,
        last_name,
        phone,
        account_type,
        user_type,
        position,
        notify_user,
        must_change_password,
      } = data;

      // Validate user email doesn't already exist
      await this.validateUserBeforeCreate({ email });

      // Hash the password
      const hashedPassword = await createHash(password_hash);

      // Create user in the database
      const createdUserInfo = await this.userRepository.createUser({
        email,
        password_hash: hashedPassword,
        username,
        first_name,
        last_name,
        phone,
        account_type: account_type ?? 'internal',
        user_type: user_type ?? 'internal',
        position,
        notify_user: notify_user ?? true,
        must_change_password: must_change_password ?? false,
        status: UserStatusEnum.pending,
        ...(createdBy && { created_by: createdBy }),
      });

      // const accessToken = await this.jwtService.signAsync(
      //   {
      //     userId: createdUserInfo.user_id.toString(),
      //   },
      //   {
      //     secret: this.accessTokenSecretKey,
      //     expiresIn: this.accessTokenExpire,
      //   },
      // );

      // const refreshToken = await this.jwtService.signAsync(
      //   {
      //     userId: createdUserInfo.user_id.toString(),
      //   },
      //   {
      //     secret: this.refreshTokenSecretKey,
      //     expiresIn: this.refreshTokenExpire,
      //   },
      // );
      const userInfoRaw = await this.userRepository.findUserById(createdUserInfo.user_id, {
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

      return new ResponseResult({
        message: SUCCESS_MSG.CREATE_USER,
        statusCode: HttpStatus.CREATED,
        data: {
          userInfo,
          // accessToken,
          // refreshToken,
        },
      });
    } catch (error) {
      handleError(error);
    }
  }

  async validateUserBeforeCreate({ email }: { email: string }) {
    const isEmailRegistered = await this.userRepository.findOneByCondition({
      email,
    });
    if (isEmailRegistered) {
      throw new ConflictException('User already exists with this email');
    }
  }
}
