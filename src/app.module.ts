import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { EventsController } from './adapters/in/rest-api/events.controller';
import { NotificationsController } from './adapters/in/rest-api/notifications.controller'; // Si lo usas
import { ChatModule } from './infrastructure/chat/chat.module';
import { EventModule } from './infrastructure/event/event.module';
import { NotificationModule } from './infrastructure/notification/notification.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { ScenesModule } from './infrastructure/scenes/scenes.module';
import { TelegramModule } from './infrastructure/telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN!,
      botName: 'echo',
      middlewares: [session()],
      include: [ScenesModule],
    }),
    ScenesModule,
    TelegramModule,
    PrismaModule,
    NotificationModule,
    EventModule,
    ChatModule,
  ],
  controllers: [NotificationsController, EventsController],
})
export class AppModule {}
