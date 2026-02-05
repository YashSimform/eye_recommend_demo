/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ResponseResult } from 'src/core/class';

@Injectable()
export class ClinicService {
  async listClinics() {
    return new ResponseResult({
      message: 'Clinics fetched',
      data: [],
    });
  }

  async createClinic(data: unknown) {
    return new ResponseResult({
      message: 'Clinic created',
      data: null,
    });
  }

  async getClinicDetail(clinicId: string) {
    return new ResponseResult({
      message: 'Clinic detail fetched',
      data: null,
    });
  }

  async updateClinic(clinicId: string, data: unknown) {
    return new ResponseResult({
      message: 'Clinic updated',
      data: null,
    });
  }

  async updateClinicStatus(clinicId: string, status: string) {
    return new ResponseResult({
      message: 'Clinic status updated',
      data: null,
    });
  }

  async getClinicProfile(clinicId: string) {
    return new ResponseResult({
      message: 'Clinic profile fetched',
      data: null,
    });
  }

  async getClinicMetadata(clinicId: string) {
    return new ResponseResult({
      message: 'Clinic metadata fetched',
      data: null,
    });
  }

  async getClinicUsers(clinicId: string) {
    return new ResponseResult({
      message: 'Clinic users fetched',
      data: [],
    });
  }

  async updateClinicUserStatus(clinicId: string, userId: string, status: string) {
    return new ResponseResult({
      message: 'Clinic user status updated',
      data: null,
    });
  }

  async removeClinicUser(clinicId: string, userId: string) {
    return new ResponseResult({
      message: 'Clinic user removed',
      data: null,
    });
  }

  async deactivateClinic(clinicId: string) {
    return new ResponseResult({
      message: 'Clinic deactivated',
      data: null,
    });
  }

  async getClinicStatusHistory(clinicId: string) {
    return new ResponseResult({
      message: 'Clinic status history fetched',
      data: [],
    });
  }
}
