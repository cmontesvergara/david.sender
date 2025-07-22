import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { SendNotificationToChatUseCase } from '../../../application/use-cases/send-notification-to-chat.use-case';
import {
  getCurrentQR,
  sendTextMessage,
} from '../../../whatsapp/baileys.client';
import { SendNotificationDto } from './dto/send-notification.dto';
@Controller('api/v1/notifications')
export class NotificationsController {
  constructor(
    private readonly sendNotification: SendNotificationToChatUseCase,
  ) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async handleNotification(@Body() body: SendNotificationDto): Promise<string> {
    await this.sendNotification.execute(body.phone, body.payload);
    return 'Notificación enviada con éxito.';
  }

  @Get('whatsapp/getQr')
  getQrCode() {
    const qr = getCurrentQR();
    if (!qr) return { status: 'connected or waiting...' };
    return { qr };
  }
  @Post('whatsapp/send')
  async sendMessage(@Body() body: SendNotificationDto) {
    await sendTextMessage(body.phone, body.payload);
    return { status: 'sent' };
  }
}
