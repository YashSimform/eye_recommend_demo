import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateNotificationDto {
  @ApiPropertyOptional({ description: 'Target user id (optional for broadcast)', example: null })
  @IsOptional()
  @IsString()
  userId?: string | null;

  @ApiProperty({ description: 'Notification title', example: 'New message' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Notification body', example: 'You have a new message.' })
  @IsString()
  body: string;

  @ApiPropertyOptional({
    description: 'Delivery channel',
    example: "email",
  })
  @IsOptional()
  channel?: string;

  @ApiPropertyOptional({ description: 'Optional metadata for provider/template', example: {} })
  @IsOptional()
  metadata?: Record<string, unknown> | null;

  @ApiPropertyOptional({
    description:
      'Optional scheduled delivery time (ISO 8601). If set, notification will be delivered 15 minutes before this time.',
    example: '2026-01-23T12:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string | null;
}
