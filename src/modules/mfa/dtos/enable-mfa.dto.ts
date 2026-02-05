import { ApiProperty } from '@nestjs/swagger';
import { MfaMethodEnum } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EnableMfaDto {
  @ApiProperty({ enum: MfaMethodEnum, example: 'email_otp' })
  @IsNotEmpty()
  @IsEnum(MfaMethodEnum)
  mfa_method: MfaMethodEnum;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone_number?: string;
}
