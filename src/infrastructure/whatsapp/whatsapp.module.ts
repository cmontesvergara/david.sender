import { PinoLoggerService } from '@/common/logger/logger.service';
import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { FileService } from './file.service';
import { WhatsappGateway } from './whatsapp.gateway';
import { WhatsappProcessor } from './whatsapp.processor';
import { WhatsappService } from './whatsapp.service';

@Module({
  imports: [NotificationModule],
  providers: [
    WhatsappProcessor,
    PinoLoggerService,
    WhatsappService,
    WhatsappGateway,
    FileService,
  ],
  exports: [WhatsappService, FileService],
})
export class WhatsappModule {}
