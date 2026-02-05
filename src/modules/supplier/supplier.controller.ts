import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SupplierService } from './supplier.service';

@ApiTags('Supplier Management')
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  @ApiOperation({
    summary: 'Supplier Listing',
    description: 'View All Suppliers',
  })
  @ApiOkResponse({ description: 'Supplier list retrieved' })
  async listSuppliers() {
    return this.supplierService.listSuppliers();
  }

  @Put(':supplierId/status')
  @ApiOperation({
    summary: 'Edit supplier status',
    description: 'Supplier status edit',
  })
  @ApiOkResponse({ description: 'Supplier status updated' })
  async editSupplierStatus(
    @Param('supplierId') supplierId: string,
    @Body() body: { status: string },
  ) {
    return this.supplierService.editSupplierStatus(supplierId, body.status);
  }

  @Get(':supplierId')
  @ApiOperation({
    summary: 'Supplier Profile',
    description: 'View Supplier Profile',
  })
  @ApiOkResponse({ description: 'Supplier profile retrieved' })
  async getSupplierProfile(@Param('supplierId') supplierId: string) {
    return this.supplierService.getSupplierProfile(supplierId);
  }

  @Get(':supplierId/promotions')
  @ApiOperation({
    summary: 'Supplier promotions',
    description: 'Get supplier promotions',
  })
  @ApiOkResponse({ description: 'Supplier promotions retrieved' })
  async getSupplierPromotions(@Param('supplierId') supplierId: string) {
    return this.supplierService.getSupplierPromotions(supplierId);
  }
}
