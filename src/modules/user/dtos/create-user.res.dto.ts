import { ApiProperty, PickType } from '@nestjs/swagger';
import { CommonResponseDto } from '../../../common/dtos';

export class CreateUserResponseDto extends PickType(CommonResponseDto, ['error'] as const) {
  @ApiProperty({ example: 'User created successfully' })
  message: string;

  @ApiProperty({ example: { id: 'uuid', email: 'user@example.com' } })
  data: { id: string; email: string } | null;
}
