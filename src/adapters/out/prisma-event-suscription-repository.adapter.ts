// adapters/out/prisma-event-repository.adapter.ts

import { Injectable } from '@nestjs/common';
import { EventSubscriptionRepository } from 'src/domain/interfaces/event-subscription-repository.interface';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaEventSubscriptionRepository
  implements EventSubscriptionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async exists(eventId: number, chatId: bigint): Promise<boolean> {
    const subscription = await this.prisma.chatOnEvent.findFirst({
      where: { eventId, chatId },
    });
    return !!subscription;
  }
}
