import { ApiProperty } from '@nestjs/swagger';
import { AccountTypeEnum, UserTypeEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DEFAULT_MAX_LENGTH } from '../../../common/constants';
import { VALIDATION_MSG } from '../../../common/messages';
import { EMAIL_REGEX, PASSWORD_DEFAULT_MIN_LENGTH, PASSWORD_REGEX } from '../../auth/auth.constant';

export class CreateUserDto {
  @ApiProperty({ example: 'johndoe' })
  @IsNotEmpty({ message: VALIDATION_MSG.NOT_EMPTY('username') })
  @IsString({ message: VALIDATION_MSG.IS_STRING('username') })
  @MaxLength(100, { message: VALIDATION_MSG.MAX_LENGTH('username', 100) })
  username: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @Transform(({ value }) => value.trim())
  @Transform(({ value }) => value.toLowerCase())
  @IsNotEmpty({ message: VALIDATION_MSG.NOT_EMPTY('email') })
  @IsEmail({}, { message: VALIDATION_MSG.IS_EMAIL('email') })
  @Matches(EMAIL_REGEX, {
    message:
      'Email must be a valid email address',
  })
  @MaxLength(255, { message: VALIDATION_MSG.MAX_LENGTH('email', 255) })
  email: string;

  @ApiProperty({ example: 'SecurePass@123' })
  @IsNotEmpty({ message: VALIDATION_MSG.NOT_EMPTY('password') })
  @IsString({ message: VALIDATION_MSG.IS_STRING('password') })
  @MinLength(PASSWORD_DEFAULT_MIN_LENGTH, {
    message: VALIDATION_MSG.MIN_LENGTH('password', PASSWORD_DEFAULT_MIN_LENGTH),
  })
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @MaxLength(DEFAULT_MAX_LENGTH, {
    message: VALIDATION_MSG.MAX_LENGTH('password', DEFAULT_MAX_LENGTH),
  })
  password_hash: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty({ message: VALIDATION_MSG.NOT_EMPTY('first_name') })
  @IsString({ message: VALIDATION_MSG.IS_STRING('first_name') })
  @MaxLength(100, { message: VALIDATION_MSG.MAX_LENGTH('first_name', 100) })
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty({ message: VALIDATION_MSG.NOT_EMPTY('last_name') })
  @IsString({ message: VALIDATION_MSG.IS_STRING('last_name') })
  @MaxLength(100, { message: VALIDATION_MSG.MAX_LENGTH('last_name', 100) })
  last_name: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString({ message: VALIDATION_MSG.IS_STRING('phone') })
  @MaxLength(50, { message: VALIDATION_MSG.MAX_LENGTH('phone', 50) })
  phone?: string;

  @ApiProperty({ example: AccountTypeEnum.internal, enum: AccountTypeEnum, required: false })
  @IsOptional()
  @IsEnum(AccountTypeEnum, { message: 'account_type must be a valid AccountTypeEnum value' })
  account_type?: AccountTypeEnum;

  @ApiProperty({ example: UserTypeEnum.internal, enum: UserTypeEnum, required: false })
  @IsOptional()
  @IsEnum(UserTypeEnum, { message: 'user_type must be a valid UserTypeEnum value' })
  user_type?: UserTypeEnum;

  @ApiProperty({ example: 'Senior Manager', required: false })
  @IsOptional()
  @IsString({ message: VALIDATION_MSG.IS_STRING('position') })
  @MaxLength(100, { message: VALIDATION_MSG.MAX_LENGTH('position', 100) })
  position?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: 'notify_user must be a boolean value' })
  notify_user?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean({ message: 'must_change_password must be a boolean value' })
  must_change_password?: boolean;
}
