/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { SendNotificationToChatUseCase } from 'application/use-cases/send-notification-to-chat.use-case';
import {
  SendTelegramNotificationDto,
  SendWhatsappNotificationDto,
} from './dto/send-notification.dto';

import { WhatsappService } from '@/infrastructure/whatsapp/whatsapp.service';
import { Response } from 'express';
@Controller('api/v1/notifications')
export class NotificationsController {
  constructor(
    private readonly sendNotification: SendNotificationToChatUseCase,
    private readonly whatsappService: WhatsappService,
  ) {}

  @Post('telegram/send')
  @HttpCode(HttpStatus.OK)
  async handleNotification(
    @Body() body: SendTelegramNotificationDto,
  ): Promise<string> {
    await this.sendNotification.execute(body.phone, body.payload);
    return 'Notificación enviada con éxito.';
  }

  @Post('whatsapp/send')
  async sendMessage(
    @Body() body: SendWhatsappNotificationDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { status, message } =
      await this.whatsappService.sendTextMessage(body);
    return res.status(status).json({ message });
  }

  @Delete('whatsapp/session/end/:phone')
  async endSession(@Param('phone') phone: string) {
    try {
      await this.whatsappService.endSession(phone);
    } catch (err: any) {
      return { error: 'Error al finalizar la sesión', details: err?.message };
    }
  }

  @Get('whatsapp/session/init/:phone')
  async init(@Param('phone') phone: string) {
    return await this.whatsappService.startSession(phone);
  }

  @Get('whatsapp/session/qr/:phone')
  async getQr(@Param('phone') phone: string) {
    const qr = await this.whatsappService.getQR(phone);
    if (!qr) return { status: 'not_ready' };
    return { qr };
  }
}
