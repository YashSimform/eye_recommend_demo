import { ApiProperty, PickType } from '@nestjs/swagger';
import { CommonResponseDto } from '../../../common/dtos';
import { UserAndTokenDataDto } from './login.res.dto';

class ResetPasswordResponseDto extends PickType(CommonResponseDto, [
  'error',
] as const) {
  @ApiProperty({ example: 'Password reset successful' })
  message: string;

  @ApiProperty({ type: UserAndTokenDataDto })
  data: UserAndTokenDataDto;
}

export { ResetPasswordResponseDto };

