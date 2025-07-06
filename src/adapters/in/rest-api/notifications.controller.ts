import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SendNotificationToChatUseCase } from '../../../application/use-cases/send-notification-to-chat.use-case';
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
}
