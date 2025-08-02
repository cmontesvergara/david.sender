import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TelegrafNotificationSender } from '../../adapters/out/telegraf-notification-sender.adapter';
import { SendNotificationToChatUseCase } from '../../application/use-cases/send-notification-to-chat.use-case';
import { TelegramModule } from '../telegram/telegram.module';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    TelegramModule,
    BullModule.registerQueue({
      name: 'whatsapp',
    }),
  ],
  providers: [
    NotificationService,

    {
      provide: SendNotificationToChatUseCase,
      useFactory: (sender: TelegrafNotificationSender) =>
        new SendNotificationToChatUseCase(sender),
      inject: [TelegrafNotificationSender],
    },
  ],
  exports: [SendNotificationToChatUseCase, NotificationService],
})
export class NotificationModule {}
