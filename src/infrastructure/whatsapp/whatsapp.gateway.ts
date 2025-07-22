import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class WhatsappGateway {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger('WhatsappGateway');

  sendToClient(event: string, data: any) {
    this.server.emit(event, data);
  }

  @SubscribeMessage('send-whatsapp')
  handleSendWhatsapp(@MessageBody() data: any): void {
    this.logger.log('Emit to WhatsApp client:', data);
    // Aquí deberías implementar una cola o emisor a Baileys
  }
}
