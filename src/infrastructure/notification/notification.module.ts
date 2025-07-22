import { Module } from '@nestjs/common';
import { TelegrafNotificationSender } from '../../adapters/out/telegraf-notification-sender.adapter';
import { SendNotificationToChatUseCase } from '../../application/use-cases/send-notification-to-chat.use-case';

@Module({
  // imports: [TelegramModule],
  providers: [
    {
      provide: SendNotificationToChatUseCase,
      useFactory: (sender: TelegrafNotificationSender) =>
        new SendNotificationToChatUseCase(sender),
      inject: [TelegrafNotificationSender],
    },
  ],
  exports: [SendNotificationToChatUseCase],
})
export class NotificationModule {}
