/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { WhatsappPath } from '@/common/constants/whatsapp-path.enum';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { SendWhatsappNotificationDto } from 'adapters/in/rest-api/dto/send-notification.dto';
import { SendNotificationToChatUseCase } from 'application/use-cases/send-notification-to-chat.use-case';
import {
  internalSocketEvents,
  WppSocketEvents,
} from 'common/events/internal-socket-events';
import { PinoLoggerService } from 'common/logger/logger.service';
import * as fs from 'fs/promises';
import { MessageFormatter } from 'shared/formatters/message-formatter';
import { RedisService } from '../redis/redis.service';
import { FileService } from './file.service';
import { WhatsappSession } from './whatsapp-session';
import { WhatsappGateway } from './whatsapp.gateway';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private sessions: Record<string, WhatsappSession> = {};

  constructor(
    private readonly gateway: WhatsappGateway,
    private readonly notificationSender: SendNotificationToChatUseCase,
    private readonly logger: PinoLoggerService,
    private readonly qrFileService: FileService,
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    internalSocketEvents.on(WppSocketEvents.SessionDisconnected, (data) => {
      const phone = data.agent;
      void this.endSession(phone);
      if (data.sendNotification) {
        void this.notificationSender.execute('573503417243', {
          meta: {
            title: 'AGENTE FUERA DE SERVICIO',
            type: 'ALERTA',
          },
          body: { ...data },
          footer: 'No compartas este código.',
        });
      }
    });

    try {
      const redis = this.redisService.getClient();
      let cursor = '0';
      const phonesSet = new Set<string>();

      do {
        const [nextCursor, keys] = await redis.scan(
          cursor,
          'MATCH',
          'baileys:session:*:creds',
          'COUNT',
          100,
        );
        cursor = nextCursor;

        for (const key of keys) {
          const parts = key.split(':');
          if (parts.length >= 4) {
            phonesSet.add(parts[2]);
          }
        }
      } while (cursor !== '0');

      const phones = Array.from(phonesSet);

      if (phones.length === 0) {
        this.logger.info(
          '🔍 No hay sesiones previas que cargar desde Redis.',
        );
        return;
      }

      this.logger.info(
        `📦 Cargando ${phones.length} sesión(es) de WhatsApp desde Redis...`,
      );

      for (const phone of phones) {
        await this.startSession(phone);
      }
    } catch (err) {
      this.logger.error(
        '❌ Error al escanear sesiones activas en Redis:',
        err,
      );
    }
  }

  async startSession(phone: string): Promise<void> {
    if (this.sessions[phone]) {
      this.logger.warn(`La sesión [${phone}] ya está activa.`);
      return;
    }

    const session = new WhatsappSession(
      phone,
      this.gateway,
      (sock) => {
        this.logger.info(`[${phone}] Socket inicializado correctamente.`);
        // podrías guardar el socket aquí si necesitas acceso directo
      },
      this.qrFileService,
      this.redisService.getClient(),
    );

    this.sessions[phone] = session;
    await session.start();
  }
  availableAgents(): any {
    return Object.keys(this.sessions).filter((phone) => this.sessions[phone]);
  }

  async getQR(phone: string): Promise<string | null> {
    const qrPath = WhatsappPath.qrFile(phone);
    try {
      const content = await fs.readFile(qrPath, 'utf-8');
      const data = JSON.parse(content);

      return data.qr;
    } catch {
      return null;
    }
  }

  async sendTextMessage(body: SendWhatsappNotificationDto) {
    const session = this.sessions[body.agent];
    if (!session) {
      this.logger.error(`[${body.agent}] Agente no inicializado.`);
      return { status: 403, message: 'Agente no disponible.' };
    }

    const labelMap = {
      otp: 'Código',
      username: 'Usuario',
      session: 'Sesión',
      message: 'Mensaje',
      empty: '',
      expiresIn: 'Expira en',
      url: 'Enlace de verificación',
    };

    const formatter = new MessageFormatter(
      { phone: body.phone, payload: body.payload },
      labelMap,
      { flatten: true },
    );

    const message = formatter.toMarkdown();
    const jid = `57${body.phone}@s.whatsapp.net`;

    await session.sendText(jid, message);
    this.logger.info(`📨 Mensaje enviado a ${jid}`);

    return { status: 200, message: 'Enviado.' };
  }

  async endSession(phone: string): Promise<void> {
    const session = this.sessions[phone];
    if (session) {
      try {
        await session.logout(phone);
      } catch (e) {
        this.logger.warn(`⚠️ Error al cerrar sesión de ${phone}:`, e);
      }
    }
    delete this.sessions[phone];
  }
}
