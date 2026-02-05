import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'SuperAdministrator';
export const RequiresPermission = (permission: string) => SetMetadata(PERMISSIONS_KEY, permission);
