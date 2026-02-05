import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.role.findMany({
      where: { is_active: true },
      include: {
        users: true,
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  async findById(roleId: number) {
    return this.prisma.role.findUnique({
      where: { role_id: roleId },
      include: {
        users: {
          include: { user: true },
        },
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  async findByName(roleName: string) {
    return this.prisma.role.findUnique({
      where: { role_name: roleName },
    });
  }

  async create(data: Prisma.RoleCreateInput) {
    return this.prisma.role.create({
      data,
      include: {
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  async update(roleId: number, data: Prisma.RoleUpdateInput) {
    return this.prisma.role.update({
      where: { role_id: roleId },
      data,
      include: {
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  async delete(roleId: number) {
    return this.prisma.role.delete({
      where: { role_id: roleId },
    });
  }

  async findUserRoles(userId: bigint) {
    return this.prisma.userRole.findMany({
      where: { user_id: userId, is_active: true },
      include: {
        role: true,
        assignedBy: true,
      },
    });
  }

  async findUserRoleByName(userId: bigint, roleName: string) {
    return this.prisma.userRole.findFirst({
      where: {
        user_id: userId,
        role: { role_name: roleName },
        is_active: true,
      },
      include: {
        role: true,
      },
    });
  }

  async assignRoleToUser(data: Prisma.UserRoleCreateInput) {
    return this.prisma.userRole.create({
      data,
      include: {
        user: true,
        role: true,
        assignedBy: true,
      },
    });
  }

  async removeRoleFromUser(userId: bigint, roleId: number) {
    return this.prisma.userRole.deleteMany({
      where: {
        user_id: userId,
        role_id: roleId,
      },
    });
  }

  async deactivateUserRole(userId: bigint, roleId: number) {
    return this.prisma.userRole.updateMany({
      where: {
        user_id: userId,
        role_id: roleId,
      },
      data: {
        is_active: false,
      },
    });
  }
}
