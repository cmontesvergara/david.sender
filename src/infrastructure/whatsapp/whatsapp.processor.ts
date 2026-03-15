// whatsapp.processor.ts
import { getLoggerWithRequestContext } from '@/common/logger/request-logger.helper';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { WhatsappService } from './whatsapp.service';

import { PrismaService } from '../prisma/prisma.service';

@Processor('whatsapp')
export class WhatsappProcessor {
  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly prisma: PrismaService,
  ) { }

  @Process('send-message')
  async handleSendMessage(job: Job) {
    const { phone, payload, trxId, agent: agentPhone } = job.data;
    const logger = getLoggerWithRequestContext();

    logger.info(
      { phone, payload, trxId, agent: agentPhone },
      `Enviando mensaje desde cola a ${phone}`,
    );

    try {
      await this.whatsappService.sendTextMessage({
        agent: agentPhone,
        phone,
        payload,
      });

      // Guardar en base de datos el envío exitoso
      await this.prisma.notificationLog.create({
        data: {
          trxId,
          phone,
          agent: agentPhone,
          payload,
          status: 'sent',
        },
      });

      // Actualizar estadísticas del agente
      const agent = await this.prisma.agent.findUnique({
        where: { phone: agentPhone },
        include: { stats: true },
      });

      if (agent?.stats) {
        await this.prisma.stats.update({
          where: { id: agent.stats.id },
          data: {
            messagesSentToday: { increment: 1 },
            messagesSentTotal: { increment: 1 },
            lastMessageAt: new Date(),
          },
        });
      }

      // Actualizar interacción con el contacto
      if (agent) {
        await this.prisma.contactInteraction.upsert({
          where: {
            // Asumiendo que phone + agent es único en la lógica de negocio, 
            // aunque el schema no tenga el composite unique. 
            // Buscamos la interacción existente para actualizarla.
            id: (await this.prisma.contactInteraction.findFirst({
              where: { phone, agentId: agent.id }
            }))?.id || 'new-uuid', // Fallback si no existe
          },
          update: {
            lastInteractionAt: new Date(),
            messagesSentCount: { increment: 1 },
          },
          create: {
            phone,
            agentId: agent.id,
            lastInteractionAt: new Date(),
            messagesSentCount: 1,
          },
        }).catch(err => logger.error('Error updating contact interaction:', err));
      }

    } catch (error: any) {
      console.error(`Error al enviar a ${phone}`, error);

      // Registrar el fallo
      await this.prisma.notificationLog.create({
        data: {
          trxId,
          phone,
          agent: agentPhone,
          payload,
          status: 'failed',
          error: error?.message || 'Unknown error',
        },
      }).catch(err => logger.error('Error saving failed notification log:', err));

      throw error; // para que Bull reintente
    }
  }
}
