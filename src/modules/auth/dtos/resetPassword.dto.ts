import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { PASSWORD_DEFAULT_MIN_LENGTH, PASSWORD_REGEX } from '../auth.constant';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Password reset token from email link',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Reset token is required' })
  token: string;

  @ApiProperty({
    description: 'New password (min 12 chars, uppercase, lowercase, number, special char !@#$%^&*)',
    example: 'NewP@ssw0rd123',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(PASSWORD_DEFAULT_MIN_LENGTH, {
    message: `Password must be at least ${PASSWORD_DEFAULT_MIN_LENGTH} characters long`,
  })
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)',
  })
  password: string;

  @ApiProperty({
    description: 'Confirm new password',
    example: 'NewP@ssw0rd123',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Confirm password is required' })
  confirmPassword: string;
}
