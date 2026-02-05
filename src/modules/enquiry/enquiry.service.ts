/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ResponseResult } from 'src/core/class';

@Injectable()
export class EnquiryService {
  async getEnquirySummary() {
    return new ResponseResult({
      message: 'Enquiry summary fetched',
      data: { totalEnquiries: 0 },
    });
  }

  async listEnquiries() {
    return new ResponseResult({
      message: 'Enquiries fetched',
      data: [],
    });
  }

  async getEnquiryDetail(enquiryId: string) {
    return new ResponseResult({
      message: 'Enquiry detail fetched',
      data: null,
    });
  }

  async updateEnquiryStatus(enquiryId: string, status: string) {
    return new ResponseResult({
      message: 'Enquiry status updated',
      data: null,
    });
  }

  async assignEnquiryToUser(enquiryId: string, userId: string) {
    return new ResponseResult({
      message: 'Enquiry assigned to user',
      data: null,
    });
  }

  async getEnquiryNotes(enquiryId: string) {
    return new ResponseResult({
      message: 'Enquiry notes fetched',
      data: [],
    });
  }

  async addEnquiryNote(enquiryId: string, note: string) {
    return new ResponseResult({
      message: 'Note added to enquiry',
      data: null,
    });
  }
}
