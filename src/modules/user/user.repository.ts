import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  createUser(userData: Omit<Prisma.UserCreateInput, 'id'>) {
    return this.prisma.user.create({
      data: userData,
    });
  }

  findOneByCondition(condition: Prisma.UserWhereInput) {
    return this.prisma.user.findFirst({
      where: condition,
    });
  }

  findUserById(userId: bigint, select?: Prisma.UserSelect) {
    return this.prisma.user.findUnique({
      where: { user_id: userId },
      ...(select && { select }),
    });
  }

  updateUser(userId: bigint, updateData: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { user_id: userId },
      data: updateData,
    });
  }
}
