// notification.service.ts
import { getLoggerWithRequestContext } from '@/common/logger/request-logger.helper';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
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
        { phone, payload, trxId, agent: agentList[agentIndex] },
        { delay, attempts: 3 },
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
