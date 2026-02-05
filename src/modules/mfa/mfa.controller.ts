import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAGS } from '../../common/constants';
import { ICurrentUser } from '../../common/interfaces';
import { CurrentUser } from '../../core/decorators/currentUser.decorator';
import { EnableMfaDto, VerifyMfaDto } from './dtos';
import { MfaService } from './mfa.service';

@ApiTags(SWAGGER_TAGS.MFA)
@Controller('mfa')
export class MfaController {
  constructor(private readonly mfaService: MfaService) {}

  @Post('enable')
  async enableMfa(@Body() enableMfaDto: EnableMfaDto, @CurrentUser() currentUser: ICurrentUser) {
    return this.mfaService.enableMfa(currentUser.user_id, enableMfaDto);
  }

  @Post('verify')
  async verifyMfa(@Body() verifyMfaDto: VerifyMfaDto, @CurrentUser() currentUser: ICurrentUser) {
    return this.mfaService.verifyMfa(currentUser.user_id, verifyMfaDto);
  }

  @Delete(':mfaId')
  async disableMfa(@Param('mfaId') mfaId: string, @CurrentUser() currentUser: ICurrentUser) {
    return this.mfaService.disableMfa(currentUser.user_id, BigInt(mfaId));
  }

  @Get('methods')
  async getUserMfaMethods(@CurrentUser() currentUser: ICurrentUser) {
    return this.mfaService.getUserMfaMethods(currentUser.user_id);
  }

  @Get('logs')
  async getMfaLogs(@CurrentUser() currentUser: ICurrentUser) {
    return this.mfaService.getMfaLogs(currentUser.user_id);
  }
}
