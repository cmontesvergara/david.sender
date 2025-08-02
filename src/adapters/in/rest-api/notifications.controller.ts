/* eslint-disable @typescript-eslint/no-unsafe-return */
import { WhatsappService } from '@/infrastructure/whatsapp/whatsapp.service';
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
import { Response } from 'express';
import {
  SendTelegramNotificationDto,
  SendWhatsappDiffusionDto,
  SendWhatsappNotificationDto,
} from './dto/send-notification.dto';

import { NotificationService } from '@/infrastructure/notification/notification.service';
import { v4 as uuidv4 } from 'uuid';
@Controller('api/v1/notifications')
export class NotificationsController {
  constructor(
    private readonly sendNotification: SendNotificationToChatUseCase,
    private readonly whatsappService: WhatsappService,
    private readonly notificationService: NotificationService,
  ) {}

  @Post('telegram/send')
  @HttpCode(HttpStatus.OK)
  async handleNotification(
    @Body() body: SendTelegramNotificationDto,
  ): Promise<string> {
    await this.sendNotification.execute(body.phone, body.payload);
    return 'Notificación enviada con éxito.';
  }

  @Post('whatsapp/send/single')
  async sendMessage(
    @Body() body: SendWhatsappNotificationDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { status, message } =
      await this.whatsappService.sendTextMessage(body);
    return res.status(status).json({ message });
  }

  @Post('whatsapp/send/diffusion')
  async send(@Body() body: SendWhatsappDiffusionDto, @Res() res: Response) {
    const transactionId = uuidv4();

    if (body.agents?.length && body.phones?.length) {
      const availableAgents = this.whatsappService.availableAgents();
      const missingAgents = body.agents.filter(
        (agent: string) => !availableAgents.includes(agent),
      );

      if (missingAgents.length > 0) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: `Algunos agentes no se encuentran disponibles.`,
          agents: missingAgents,
        });
      }
      await this.notificationService.enqueueMessages({
        phoneList: body.phones,
        agentList: body.agents,
        payload: body.message,
        trxId: transactionId,
        options: body.options,
      });

      res.status(HttpStatus.ACCEPTED).json({
        transactionId,
        message: 'Envío en segundo plano en curso.',
      });
    }

    return { message: 'Debe especificar phones' };
  }
  @Get('whatsapp/agent/available')
  availableAgents() {
    return this.whatsappService.availableAgents();
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
