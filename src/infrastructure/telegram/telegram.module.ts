import { Global, Module } from '@nestjs/common';
import { PrismaChatRepository } from 'adapters/out/prisma-chat-repository.adapter';
import { PrismaEventSubscriptionRepository } from 'adapters/out/prisma-event-suscription-repository.adapter';
import { TelegrafNotificationSender } from 'adapters/out/telegraf-notification-sender.adapter';
@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: 'ChatRepository',
      useClass: PrismaChatRepository,
    },
    {
      provide: 'EventSubscriptionRepository',
      useClass: PrismaEventSubscriptionRepository,
    },

    TelegrafNotificationSender,
  ],
  exports: [
    TelegrafNotificationSender,
    'ChatRepository',
    'EventSubscriptionRepository',
  ],
})
export class TelegramModule {}
