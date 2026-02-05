import {Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAGS } from '../../common/constants';
import { RoleService } from './role.service';
import { Public } from 'src/core/decorators';

@ApiTags(SWAGGER_TAGS.ROLE)
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}


  @ApiOperation({
    summary: 'Get all roles API',
    description: 'This API is used to fetch all roles',
  })
  @ApiOkResponse({
    description: 'Roles fetched successfully',
  })
  @Public()
  @Get('/')
   getAllRoles() {
    return this.roleService.getAllRoles();
  }
}
