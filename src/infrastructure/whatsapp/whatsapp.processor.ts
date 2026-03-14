// whatsapp.processor.ts
import { getLoggerWithRequestContext } from '@/common/logger/request-logger.helper';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { WhatsappService } from './whatsapp.service';

@Processor('whatsapp')
export class WhatsappProcessor {
  constructor(private readonly whatsappService: WhatsappService) { }

  @Process('send-message')
  async handleSendMessage(job: Job) {
    const { phone, payload, trxId, agent } = job.data;
    getLoggerWithRequestContext().info(
      { phone, payload, trxId, agent },
      `Enviando mensaje desde cola a ${phone}`,
    );

    try {
      await this.whatsappService.sendTextMessage({
        agent,
        phone,
        payload,
      });
      //TODO: guardar en base de datos el envio
      //TODO: eliminar de la cola o evaluar un cron para limpiar la cola

    } catch (error) {
      console.error(`Error al enviar a ${phone}`, error);
      throw error; // para que Bull reintente si configuraste attempts
    }
  }
}
