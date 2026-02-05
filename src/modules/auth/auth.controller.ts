import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { SWAGGER_TAGS } from '../../common/constants';
// import { ICurrentUser } from '../../common/interfaces';
import { Public } from '../../core/decorators';
import { AuthService } from './auth.service';
import {
  // ChangePasswordDto,
  // ChangePasswordResponseDto,
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  LoginDto,
  LoginResponseDto,
  LogoutResponseDto,
  RefreshTokenResponseDto,
  ResetPasswordDto,
  ResetPasswordResponseDto,
} from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags(SWAGGER_TAGS.AUTH)
  @ApiOperation({
    summary: 'Login API',
    description: 'This API is used to login',
  })
  @ApiOkResponse({
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @Public()
  @Post('/login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @ApiTags(SWAGGER_TAGS.AUTH)
  @ApiOperation({
    summary: 'Refresh Token API',
    description: 'This API is used to create new access token from refresh token',
  })
  @ApiOkResponse({
    description: 'Refresh token generated successfully',
    type: RefreshTokenResponseDto,
  })
  @Public()
  @Post('/refresh-token')
  refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    return this.authService.refreshToken(refreshToken, res);
  }

  @ApiTags(SWAGGER_TAGS.AUTH)
  @ApiOperation({
    summary: 'Logout API',
    description: 'This API is used to logout and clear cookies',
  })
  @ApiOkResponse({
    description: 'Logout successful',
    type: LogoutResponseDto,
  })
  @Post('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @ApiTags(SWAGGER_TAGS.AUTH)
  @ApiOperation({
    summary: 'Forgot Password API',
    description: 'This API is used to request a password reset link',
  })
  @ApiOkResponse({
    description: 'Password reset link sent to your email',
    type: ForgotPasswordResponseDto,
  })
  @Public()
  @Post('/forgot-password')
  forgotPassword(@Body() data: ForgotPasswordDto) {
    return this.authService.forgotPassword(data);
  }

  @ApiTags(SWAGGER_TAGS.AUTH)
  @ApiOperation({
    summary: 'Reset Password API',
    description: 'This API is used to reset password with token from email',
  })
  @ApiOkResponse({
    description: 'Password reset successful',
    type: ResetPasswordResponseDto,
  })
  @Public()
  @Post('/reset-password')
  resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }

  // @ApiTags(SWAGGER_TAGS.AUTH)
  // @ApiOperation({
  //   summary: 'Change password API',
  //   description: 'This API is used to change password',
  // })
  // @ApiOkResponse({
  //   description: 'Change password successful',
  //   type: ChangePasswordResponseDto,
  // })
  // @Post('/change-password')
  // changePassword(@CurrentUser() currentUser: ICurrentUser, @Body() data: ChangePasswordDto) {
  //   return this.authService.changePassword(currentUser.userId, data);
  // }
}
