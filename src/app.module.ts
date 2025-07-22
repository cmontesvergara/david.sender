/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { EventsController } from './adapters/in/rest-api/events.controller';
import { NotificationsController } from './adapters/in/rest-api/notifications.controller'; // Si lo usas
import { ChatModule } from './infrastructure/chat/chat.module';
import { EventModule } from './infrastructure/event/event.module';
import { NotificationModule } from './infrastructure/notification/notification.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { ScenesModule } from './infrastructure/scenes/scenes.module';
import { TelegramModule } from './infrastructure/telegram/telegram.module';
import { WhatsappGateway } from './whatsapp/whatsapp.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TelegrafModuleOptions> => ({
        token: configService.get<string>('BOT_TOKEN')!,
        middlewares: [session()],
        include: [ScenesModule],
      }),
    }),
    ScenesModule,
    TelegramModule,
    PrismaModule,
    NotificationModule,
    EventModule,
    ChatModule,
  ],
  controllers: [NotificationsController, EventsController],
  providers: [WhatsappGateway],
})
export class AppModule {}
