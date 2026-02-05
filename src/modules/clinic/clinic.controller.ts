import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClinicService } from './clinic.service';

@ApiTags('Clinic Management')
@Controller('clinics')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Get()
  @ApiOperation({
    summary: 'Clinic Listing',
    description: 'List clinics (pagination, filters)',
  })
  @ApiOkResponse({ description: 'Clinic list retrieved' })
  async listClinics() {
    return this.clinicService.listClinics();
  }

  @Post()
  @ApiOperation({
    summary: 'Create Clinic',
    description: 'Create a new clinic',
  })
  @ApiOkResponse({ description: 'Clinic created' })
  async createClinic(@Body() body: unknown) {
    return this.clinicService.createClinic(body);
  }

  @Get(':clinicId')
  @ApiOperation({
    summary: 'Get clinic basic info',
    description: 'Get clinic basic info',
  })
  @ApiOkResponse({ description: 'Clinic info retrieved' })
  async getClinicDetail(@Param('clinicId') clinicId: string) {
    return this.clinicService.getClinicDetail(clinicId);
  }

  @Put(':clinicId')
  @ApiOperation({
    summary: 'Update clinic',
    description: 'Update clinic details',
  })
  @ApiOkResponse({ description: 'Clinic updated' })
  async updateClinic(@Param('clinicId') clinicId: string, @Body() body: unknown) {
    return this.clinicService.updateClinic(clinicId, body);
  }

  @Patch(':clinicId/status')
  @ApiOperation({
    summary: 'Update clinic status',
    description: 'Update clinic active/inactive status',
  })
  @ApiOkResponse({ description: 'Clinic status updated' })
  async updateClinicStatus(@Param('clinicId') clinicId: string, @Body() body: { status: string }) {
    return this.clinicService.updateClinicStatus(clinicId, body.status);
  }

  @Get(':clinicId/profile')
  @ApiOperation({
    summary: 'Clinic details',
    description: 'Get complete clinic profile',
  })
  @ApiOkResponse({ description: 'Clinic profile retrieved' })
  async getClinicProfile(@Param('clinicId') clinicId: string) {
    return this.clinicService.getClinicProfile(clinicId);
  }

  @Get(':clinicId/metadata')
  @ApiOperation({
    summary: 'Clinic metadata',
    description: 'Get clinic metadata',
  })
  @ApiOkResponse({ description: 'Clinic metadata retrieved' })
  async getClinicMetadata(@Param('clinicId') clinicId: string) {
    return this.clinicService.getClinicMetadata(clinicId);
  }

  @Get(':clinicId/users')
  @ApiOperation({
    summary: 'Users Clinic',
    description: 'Get users linked to clinic',
  })
  @ApiOkResponse({ description: 'Clinic users retrieved' })
  async getClinicUsers(@Param('clinicId') clinicId: string) {
    return this.clinicService.getClinicUsers(clinicId);
  }

  @Patch(':clinicId/users/:userId/status')
  @ApiOperation({
    summary: 'Update clinic user status',
    description: 'Update clinic user status',
  })
  @ApiOkResponse({ description: 'User status updated' })
  async updateClinicUserStatus(
    @Param('clinicId') clinicId: string,
    @Param('userId') userId: string,
    @Body() body: { status: string },
  ) {
    return this.clinicService.updateClinicUserStatus(clinicId, userId, body.status);
  }

  @Delete(':clinicId/users/:userId')
  @ApiOperation({
    summary: 'Remove user',
    description: 'Remove user from clinic',
  })
  @ApiOkResponse({ description: 'User removed' })
  async removeClinicUser(@Param('clinicId') clinicId: string, @Param('userId') userId: string) {
    return this.clinicService.removeClinicUser(clinicId, userId);
  }

  @Post(':clinicId/deactivate')
  @ApiOperation({
    summary: 'clinic status update',
    description: 'Deactivate clinic',
  })
  @ApiOkResponse({ description: 'Clinic deactivated' })
  async deactivateClinic(@Param('clinicId') clinicId: string) {
    return this.clinicService.deactivateClinic(clinicId);
  }

  @Get(':clinicId/status-history')
  @ApiOperation({
    summary: 'clinic status',
    description: 'Get clinic status history',
  })
  @ApiOkResponse({ description: 'Clinic status history retrieved' })
  async getClinicStatusHistory(@Param('clinicId') clinicId: string) {
    return this.clinicService.getClinicStatusHistory(clinicId);
  }
}
