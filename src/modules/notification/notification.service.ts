import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { NotificationProvider } from './providers/notification.provider';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly provider: NotificationProvider,
  ) {}

  // async create(dto: CreateNotificationDto) {
  //   // map DTO -> Prisma create input and cast metadata/scheduledAt to correct types
  //   const notification = await this.prisma.notification.create({
  //     data: {
  //       userId: dto.userId ?? null,
  //       title: dto.title,
  //       body: dto.body,
  //       channel: dto.channel,
  //       metadata: dto.metadata as unknown as Prisma.JsonValue,
  //       scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
  //     },
  //   });

  //   // attempt delivery (provider may be a no-op in tests)
  //   try {
  //     // map fields explicitly to match provider signature and cast metadata to Prisma.JsonValue
  //     await this.provider.send({
  //       id: notification.id,
  //       userId: dto.userId ?? undefined,
  //       title: dto.title,
  //       body: dto.body,
  //       channel: dto.channel as unknown as string | undefined,
  //       metadata: dto.metadata as unknown as Prisma.JsonValue,
  //     });
  //     await this.prisma.notification.update({
  //       where: { id: notification.id },
  //       data: { delivered: true },
  //     });
  //     // Log delivery to console/logger for verification
  //     try {
  //       const recipient =
  //         ((dto.metadata as unknown as Record<string, unknown>)?.email as string | undefined) ??
  //         dto.userId ??
  //         'unknown';
  //       this.logger.log(`Notification delivered (id=${notification.id}) to=${recipient}`);
  //     } catch {
  //       // ignore logging errors
  //     }
  //   } catch (err) {
  //     handleError(err);
  //   }

  //   return notification;
  // }

  // async listForUser(userId: string) {
  //   return this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  // }

  // async markRead(id: string) {
  //   return this.prisma.notification.update({ where: { id }, data: { read: true } });
  // }

  // async sendDueNotifications() {
  //   const now = new Date();
  //   // Trigger delivery 15 minutes before scheduledAt
  //   const threshold = new Date(now.getTime() + 15 * 60 * 1000);
  //   const due = await this.prisma.notification.findMany({
  //     where: {
  //       delivered: false,
  //       AND: [
  //         {
  //           OR: [{ scheduledAt: null }, { scheduledAt: { lte: threshold } }],
  //         },
  //       ],
  //     },
  //   });
  //   const tasks = due.map(async n => {
  //     try {
  //       await this.provider.send({
  //         id: n.id,
  //         userId: n.userId,
  //         title: n.title,
  //         body: n.body,
  //         channel: n.channel,
  //         metadata: n.metadata,
  //       });
  //       await this.prisma.notification.update({ where: { id: n.id }, data: { delivered: true } });
  //       try {
  //         const recipient =
  //           ((n.metadata as unknown as Record<string, unknown>)?.email as string | undefined) ??
  //           n.userId ??
  //           'unknown';
  //         this.logger.log(`Notification delivered (id=${n.id}) to=${recipient}`);
  //       } catch {
  //         handleError(new Error('Logging notification delivery failed'));
  //       }
  //     } catch (err) {
  //       handleError(err);
  //     }
  //   });
  //   await Promise.allSettled(tasks);
  //   return due.length;
  // }
}
