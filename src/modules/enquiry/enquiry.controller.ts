import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnquiryService } from './enquiry.service';

@ApiTags('Enquiry Management')
@Controller('enquiries')
export class EnquiryController {
  constructor(private readonly enquiryService: EnquiryService) {}

  @Get('summary')
  @ApiOperation({
    summary: 'Enquiry Dashboard',
    description: 'KPI widgets – total enquiries count',
  })
  @ApiOkResponse({ description: 'Enquiry summary retrieved' })
  async getEnquirySummary() {
    return this.enquiryService.getEnquirySummary();
  }

  @Get()
  @ApiOperation({
    summary: 'All Enquiries Listing',
    description: 'List all enquiries',
  })
  @ApiOkResponse({ description: 'Enquiries list retrieved' })
  async listEnquiries() {
    return this.enquiryService.listEnquiries();
  }

  @Get(':enquiryId')
  @ApiOperation({
    summary: 'Enquiry Detail',
    description: 'Get enquiry detail',
  })
  @ApiOkResponse({ description: 'Enquiry detail retrieved' })
  async getEnquiryDetail(@Param('enquiryId') enquiryId: string) {
    return this.enquiryService.getEnquiryDetail(enquiryId);
  }

  @Put(':enquiryId/status')
  @ApiOperation({
    summary: 'Update enquiry status',
    description: 'Update enquiry status',
  })
  @ApiOkResponse({ description: 'Enquiry status updated' })
  async updateEnquiryStatus(
    @Param('enquiryId') enquiryId: string,
    @Body() body: { status: string },
  ) {
    return this.enquiryService.updateEnquiryStatus(enquiryId, body.status);
  }

  @Put(':enquiryId/assign')
  @ApiOperation({
    summary: 'Assign enquiry to user',
    description: 'Assign enquiry to Salesforce user',
  })
  @ApiOkResponse({ description: 'Enquiry assigned' })
  async assignEnquiryToUser(
    @Param('enquiryId') enquiryId: string,
    @Body() body: { userId: string },
  ) {
    return this.enquiryService.assignEnquiryToUser(enquiryId, body.userId);
  }

  @Get(':enquiryId/notes')
  @ApiOperation({
    summary: 'Enquiry Notes',
    description: 'Get internal notes for enquiry',
  })
  @ApiOkResponse({ description: 'Enquiry notes retrieved' })
  async getEnquiryNotes(@Param('enquiryId') enquiryId: string) {
    return this.enquiryService.getEnquiryNotes(enquiryId);
  }

  @Post(':enquiryId/notes')
  @ApiOperation({
    summary: 'Add internal note to enquiry',
    description: 'Add internal note to enquiry',
  })
  @ApiOkResponse({ description: 'Note added' })
  async addEnquiryNote(@Param('enquiryId') enquiryId: string, @Body() body: { note: string }) {
    return this.enquiryService.addEnquiryNote(enquiryId, body.note);
  }
}
