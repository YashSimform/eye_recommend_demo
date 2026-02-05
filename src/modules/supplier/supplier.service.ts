/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ResponseResult } from 'src/core/class';

@Injectable()
export class SupplierService {
  async listSuppliers() {
    return new ResponseResult({
      message: 'Suppliers fetched',
      data: [],
    });
  }

  async editSupplierStatus(supplierId: string, status: string) {
    return new ResponseResult({
      message: 'Supplier status updated',
      data: null,
    });
  }

  async getSupplierProfile(supplierId: string) {
    return new ResponseResult({
      message: 'Supplier profile fetched',
      data: null,
    });
  }

  async getSupplierPromotions(supplierId: string) {
    return new ResponseResult({
      message: 'Supplier promotions fetched',
      data: [],
    });
  }
}
