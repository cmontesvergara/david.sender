import { Global, Module } from '@nestjs/common';
import { PrismaEventSubscriptionRepository } from 'src/adapters/out/prisma-event-suscription-repository.adapter';
import { TelegrafNotificationSender } from 'src/adapters/out/telegraf-notification-sender.adapter';
import { PrismaChatRepository } from '../../adapters/out/prisma-chat-repository.adapter';
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
