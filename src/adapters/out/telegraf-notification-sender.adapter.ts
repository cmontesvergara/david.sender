import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { TelegramMessageFormatter } from 'src/shared/helpers/telegram-message-formatter';
import { Telegraf } from 'telegraf';
import { NotificationSender } from '../../domain/interfaces/notification-sender.interface';

@Injectable()
export class TelegrafNotificationSender implements NotificationSender {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf<any>,
    private prismaService: PrismaService,
  ) {}

  async send(phone: string, payload: any): Promise<void> {
    if (phone.length <= 10) {
      phone = `57${phone}`; // Ensure phone number is in international format
    }
    const chat = await this.prismaService.chat.findUnique({
      where: { phone: phone },
    });
    if (!chat) {
      console.error(`Chat not found for phone: ${phone}`);
      return;
    }
    console.log(`Sending message to chat ID: ${chat.id}.`);

    console.log('payload', payload);
    const labelMap = {
      otp: 'Código',
      username: 'Usuario',
      session: 'Sesión',
      expiresIn: 'Expira en',
      url: 'Enlace de verificación',
    };

    const formatter = new TelegramMessageFormatter(
      { phone, payload },
      labelMap,
      true,
    );

    const md = formatter.toMarkdown();

    await this.bot.telegram.sendMessage(chat.id.toString(), md, {
      parse_mode: 'Markdown',
    });
  }
}
