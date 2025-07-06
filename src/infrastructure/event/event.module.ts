import { Module } from '@nestjs/common';
import { SubscribeToEventUseCase } from 'src/application/use-cases/subscribe-to-event.use-case';
import { ChatRepository } from 'src/domain/interfaces/chat-repository.interface';
import { EventSubscriptionRepository } from 'src/domain/interfaces/event-subscription-repository.interface';
import { PrismaEventRepository } from '../../adapters/out/prisma-event-repository.adapter';
import { CreateEventUseCase } from '../../application/use-cases/create-event.use-case';

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
