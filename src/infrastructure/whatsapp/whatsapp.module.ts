import { PinoLoggerService } from '@/common/logger/logger.service';
import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { FileService } from './file.service';
import { WhatsappGateway } from './whatsapp.gateway';
import { WhatsappService } from './whatsapp.service';

@Module({
  imports: [NotificationModule],
  providers: [
    PinoLoggerService,
    WhatsappService,
    WhatsappGateway,
    FileService,
  ],
  exports: [WhatsappService, FileService],
})
export class WhatsappModule {}
