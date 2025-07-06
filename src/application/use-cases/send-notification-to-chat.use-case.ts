import { Injectable } from '@nestjs/common';
import { NotificationSender } from '../../domain/interfaces/notification-sender.interface';

@Injectable()
export class SendNotificationToChatUseCase {
  constructor(private readonly notificationSender: NotificationSender) {}

  async execute(phone: string, payload: any): Promise<void> {
    // Aquí puedes agregar validaciones, logs, etc.
    await this.notificationSender.send(phone, payload);
  }
}
