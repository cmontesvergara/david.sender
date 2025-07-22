/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Module } from '@nestjs/common';
import { PrismaEventRepository } from 'adapters/out/prisma-event-repository.adapter';
import { CreateEventUseCase } from 'application/use-cases/create-event.use-case';
import { SubscribeToEventUseCase } from 'application/use-cases/subscribe-to-event.use-case';
import { ChatRepository } from 'domain/interfaces/chat-repository.interface';
import { EventSubscriptionRepository } from 'domain/interfaces/event-subscription-repository.interface';

@Module({
  imports: [],
  providers: [
    PrismaEventRepository,
    {
      provide: CreateEventUseCase,
      useFactory: (repo: PrismaEventRepository) => new CreateEventUseCase(repo),
      inject: [PrismaEventRepository],
    },
    {
      provide: SubscribeToEventUseCase,
      useFactory: (
        chatRepo: ChatRepository,
        eventSubRepo: EventSubscriptionRepository,
      ) => new SubscribeToEventUseCase(chatRepo, eventSubRepo),
      inject: ['ChatRepository', 'EventSubscriptionRepository'],
    },
  ],
  exports: [CreateEventUseCase, SubscribeToEventUseCase],
})
export class EventModule {}
