// notification.service.ts
import { getLoggerWithRequestContext } from '@/common/logger/request-logger.helper';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
type EnqueueMessagesParams = {
  phoneList: string[];
  agentList: string[];
  payload: any;
  trxId: string;
  options?: Record<string, any> & { delay?: number };
};
@Injectable()
export class NotificationService {
  constructor(@InjectQueue('whatsapp') private whatsappQueue: Queue) {}

  /**
   * Verifica si existe un job con el jobId dado
   */
  async exists(jobId: string): Promise<boolean> {
    const job = await this.whatsappQueue.getJob(jobId);
    return !!job;
  }

  /**
   * Obtiene el job por jobId
   */
  async getJob(jobId: string): Promise<Job | null> {
    return this.whatsappQueue.getJob(jobId);
  }

  /**
   * Promueve un job delayed a waiting para que se ejecute ya
   */
  async promoteJob(jobId: string): Promise<boolean> {
    const job = await this.whatsappQueue.getJob(jobId);
    if (!job) return false;

    const state = await job.getState();
    if (state === 'delayed') {
      await job.promote();
      return true;
    }
    return false; // no estaba delayed
  }

  async enqueueMessages({
    phoneList,
    agentList,
    payload,
    trxId,
    options,
  }: EnqueueMessagesParams) {
    let agentIndex = 0;
    for (const phone of phoneList) {
      const delay = options?.delay ?? Math.floor(Math.random() * 60000); // 0–60s
      await this.whatsappQueue.add(
        'send-message',
        {
          jobId: options?.JobId,
          phone,
          payload,
          trxId,
          agent: agentList[agentIndex],
        },
        {
          delay,
          attempts: 3,
          removeOnComplete: true, // Limpia automáticamente al completar
          removeOnFail: {
            count: 100, // Mantiene los últimos 100 fallidos para auditoría
          },
        },
      );
      getLoggerWithRequestContext().info(
        {
          phone,
          trxId,
          delay,
        },
        `Enqueued message for phone: ${phone}, trxId: ${trxId}, delay: ${delay}`,
      );
      if (agentList.length > 0) {
        agentIndex = (agentIndex + 1) % agentList.length; // Rotate through agents
      }
    }
  }
}
