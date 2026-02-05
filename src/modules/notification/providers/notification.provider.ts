import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

export abstract class NotificationProvider {
  abstract send(payload: {
    id?: string;
    userId?: string;
    title: string;
    body: string;
    channel?: string;
    metadata?: Prisma.JsonValue;
  }): Promise<void>;
}

@Injectable()
export class EmailNotificationProvider implements NotificationProvider {
  async send(payload: {
    id?: string;
    userId?: string;
    title: string;
    body: string;
    channel?: string;
    metadata?: Prisma.JsonValue;
  }) {
    // Basic stub: in production replace with a real email service (SES, SendGrid, etc.)
    // Keep this synchronous-ish and non-throwing so DB record persists even if provider is unavailable.
    /* eslint-disable no-console */
    // Try to read an email address from metadata first, fall back to userId
    const meta = payload.metadata as unknown as Record<string, unknown> | undefined;
    const recipient = (meta?.email as string | undefined) ?? payload.userId ?? 'unknown';
    console.log('[EmailNotificationProvider] send', {
      id: payload.id,
      to: recipient,
      subject: payload.title,
      channel: payload.channel,
    });
    return Promise.resolve();
  }
}
