import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { VALIDATION_MSG } from '../../../common/messages';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: true,
  })
  @IsString({ message: VALIDATION_MSG.IS_STRING('Email') })
  @IsNotEmpty({ message: VALIDATION_MSG.NOT_EMPTY('Email') })
  @IsEmail({}, { message: VALIDATION_MSG.IS_EMAIL('Email') })
  email: string;
}
