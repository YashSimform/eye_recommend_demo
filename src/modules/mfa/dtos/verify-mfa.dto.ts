import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyMfaDto {
  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  otp_code: string;
}
