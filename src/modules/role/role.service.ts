import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseResult } from 'src/core/class';
import { SUCCESS_MSG } from './messages';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async getAllRoles() {
    const roles = await this.roleRepository.findAll();

    return new ResponseResult({
      message: SUCCESS_MSG.ROLE.CREATED,
      statusCode: HttpStatus.OK,
      data: roles.map(role => ({
        role_id: role.role_id,
        role_name: role.role_name,
        display_name: role.display_name,
        description: role.description,
        is_system_role: role.is_system_role,
        is_active: role.is_active,
        permissions: role.permissions,
        priority: role.priority,
        created_by: role.created_by,
        created_at: role.created_at,
        updated_at: role.updated_at,
      })),
    });
  }

  async getUserRoles(userId: bigint) {
    return this.roleRepository.findUserRoles(userId);
  }

  async isSuperAdministrator(userId: bigint): Promise<boolean> {
    const userRole = await this.roleRepository.findUserRoleByName(userId, 'SuperAdministrator');
    return !!userRole;
  }

  async hasRole(userId: bigint, roleName: string): Promise<boolean> {
    const userRole = await this.roleRepository.findUserRoleByName(userId, roleName);
    return !!userRole;
  }

  async hasPermission(userId: bigint, permissionKey: string): Promise<boolean> {
    const userRoles = await this.roleRepository.findUserRoles(userId);

    if (!userRoles || userRoles.length === 0) {
      return false;
    }

    for (const userRole of userRoles) {
      const permissions = userRole.role.permissions as Record<string, boolean>;
      if (permissions && permissions[permissionKey]) {
        return true;
      }
    }

    return false;
  }

  // async createRole(createRoleDto: CreateRoleDto, userId: bigint) {
  //   return this.prisma.role.create({
  //     data: {
  //       role_name: createRoleDto.role_name,
  //       display_name: createRoleDto.display_name,
  //       description: createRoleDto.description,
  //       is_system_role: createRoleDto.is_system_role ?? false,
  //       is_active: createRoleDto.is_active ?? true,
  //       permissions: createRoleDto.permissions,
  //       priority: createRoleDto.priority ?? 0,
  //       created_by: userId,
  //       updated_by: userId,
  //     },
  //     include: {
  //       createdBy: true,
  //       updatedBy: true,
  //     },
  //   });
  // }

  // async getRoleById(roleId: number) {
  //   const role = await this.prisma.role.findUnique({
  //     where: { role_id: roleId },
  //     include: {
  //       users: {
  //         include: { user: true },
  //       },
  //       createdBy: true,
  //       updatedBy: true,
  //     },
  //   });

  //   if (!role) {
  //     throw new NotFoundException('Role not found');
  //   }

  //   return role;
  // }

  // async updateRole(roleId: number, updateData: Partial<CreateRoleDto>, userId: bigint) {
  //   await this.getRoleById(roleId);

  //   return this.prisma.role.update({
  //     where: { role_id: roleId },
  //     data: {
  //       ...(updateData.role_name && { role_name: updateData.role_name }),
  //       ...(updateData.display_name && { display_name: updateData.display_name }),
  //       ...(updateData.description !== undefined && { description: updateData.description }),
  //       ...(updateData.is_system_role !== undefined && {
  //         is_system_role: updateData.is_system_role,
  //       }),
  //       ...(updateData.is_active !== undefined && { is_active: updateData.is_active }),
  //       ...(updateData.permissions !== undefined && { permissions: updateData.permissions }),
  //       ...(updateData.priority !== undefined && { priority: updateData.priority }),
  //       updated_by: userId,
  //     },
  //     include: {
  //       createdBy: true,
  //       updatedBy: true,
  //     },
  //   });
  // }

  // async assignRoleToUser(roleId: number, userId: bigint, assignedBy: bigint) {
  //   await this.getRoleById(roleId);

  //   const user = await this.prisma.user.findUnique({
  //     where: { user_id: userId },
  //   });

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   return this.prisma.userRole.create({
  //     data: {
  //       user_id: userId,
  //       role_id: roleId,
  //       assigned_by: assignedBy,
  //     },
  //     include: {
  //       user: true,
  //       role: true,
  //       assignedBy: true,
  //     },
  //   });
  // }

  // async removeRoleFromUser(userId: bigint, roleId: number) {
  //   return this.prisma.userRole.deleteMany({
  //     where: {
  //       user_id: userId,
  //       role_id: roleId,
  //     },
  //   });
  // }

  // async getUserRoles(userId: bigint) {
  //   return this.prisma.userRole.findMany({
  //     where: { user_id: userId, is_active: true },
  //     include: {
  //       role: true,
  //       assignedBy: true,
  //     },
  //   });
  // }

  // async deactivateRole(roleId: number, userId: bigint) {
  //   return this.prisma.role.update({
  //     where: { role_id: roleId },
  //     data: {
  //       is_active: false,
  //       updated_by: userId,
  //     },
  //   });
  // }
}
