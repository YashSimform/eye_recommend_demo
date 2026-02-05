import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ nullable: true })
  userId?: string | null;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  channel: 'email' | 'push' | 'sms';

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  delivered: boolean;

  @ApiProperty({ type: 'object', nullable: true })
  metadata?: Record<string, unknown>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
