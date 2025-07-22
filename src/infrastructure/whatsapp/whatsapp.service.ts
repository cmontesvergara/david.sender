/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { WASocket } from '@whiskeysockets/baileys';
import { SendWhatsappNotificationDto } from 'adapters/in/rest-api/dto/send-notification.dto';
import { SendNotificationToChatUseCase } from 'application/use-cases/send-notification-to-chat.use-case';
import {
  internalSocketEvents,
  WppSocketEvents,
} from 'common/events/internal-socket-events';
import { PinoLoggerService } from 'common/logger/logger.service';
import * as fs from 'fs/promises';
import * as path from 'path';
import { MessageFormatter } from 'shared/formatters/message-formatter';
import { startBaileys, WppSessionDisconnectEvent } from './baileys.client';
import { WhatsappGateway } from './whatsapp.gateway';
@Injectable()
export class WhatsappService implements OnModuleInit {
  private sessions: Record<string, WASocket> = {};
  private sessionStates: Record<
    string,
    'connecting' | 'connected' | 'disconnected'
  > = {};

  constructor(
    private readonly gateway: WhatsappGateway,
    private readonly sendNotification: SendNotificationToChatUseCase,
    private readonly logger: PinoLoggerService,
  ) {}

  async onModuleInit() {
    internalSocketEvents.on(
      WppSocketEvents.SessionDisconnected,
      (data: WppSessionDisconnectEvent) => {
        void this.endSession(data['agent']);
        void this.sendNotification.execute('573503417243', {
          meta: {
            title: 'AGENTE FUERA DE SERVICIO',
            type: 'ALERTA',
          },
          body: {
            ...data,
          },
          footer: 'No compartas este código.',
        });
      },
    );
    const authDir = path.join(__dirname, '..', '..', 'auth');
    try {
      const exists = await fs
        .access(authDir)
        .then(() => true)
        .catch(() => false);

      if (!exists) {
        console.log(
          '🔍 La carpeta ./auth no existe, no hay sesiones previas que cargar.',
        );
        return;
      }

      const entries = await fs.readdir(authDir, { withFileTypes: true });
      const phoneFolders = entries
        .filter((entry) => entry.isDirectory())
        .map((dir) => dir.name);

      for (const phone of phoneFolders) {
        await this.startSession(phone);
      }
    } catch (err) {
      console.error('Error leyendo directorio ./auth:', err);
    }
  }

  async startSession(phone: string) {
    const state = this.sessionStates[phone];
    this.logger.info(`sessionState rescued [${state}]`);
    if (state === 'connecting' || state === 'connected') return;

    this.sessionStates[phone] = 'connecting';
    this.logger.info(`sessionState updated [${state}]`);
    try {
      await startBaileys(phone, this.gateway, (sock) => {
        this.sessions[phone] = sock;
        this.sessionStates[phone] = 'connected';
      });
    } catch (err) {
      this.sessionStates[phone] = 'disconnected';
      this.logger.error(`[${phone}] Error al iniciar sesión`, err);
    }
  }

  async getQR(phone: string): Promise<string | null> {
    const state = this.sessionStates[phone];
    console.log(state);
    if (state === 'connecting' || state === 'connected') return null;
    const qrPath = path.join(
      __dirname,
      '..',
      '..',
      'auth',
      `${phone}`,
      `qr-${phone}.json`,
    );
    try {
      const content = await fs.readFile(qrPath, 'utf-8');
      const data = JSON.parse(content);
      setTimeout(() => {
        try {
          void fs.rm(qrPath, { recursive: true, force: true });
          this.logger.info(`🧹 QR expirado eliminado: qr-${phone}.json`);
        } catch (e) {
          this.logger.warn(
            `⚠️ No se pudo eliminar el QR expirado para el agente: ${phone}:`,
            e,
          );
        }
      }, 30000);
      return {
        ...data.qr,
        expireOn: 30000,
      }; //
    } catch {
      return null;
    }
  }
  async sendTextMessage(body: SendWhatsappNotificationDto) {
    const sock = this.sessions[body.agent];
    this.logger.info('socket successfully rescued');
    if (!sock) {
      this.logger.error(`[${body.agent}] WhatsApp Agent not initialized`);
      return {
        status: 403,
        message: ' Agent not Available.',
      };
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
    this.logger.info('payload successfully formatted');
    const md = formatter.toMarkdown();
    const reciper = `57${body.phone}`;
    await sock.sendMessage(`${reciper}@s.whatsapp.net`, {
      text: md,
    });
    this.logger.info(`message successfully sended to ${reciper}`);
    return {
      status: 200,
      message: 'sent.',
    };
  }
  async endSession(phone: string): Promise<void> {
    const session = this.sessions[phone];
    if (session) {
      try {
        await session.logout();
      } catch (e) {
        this.logger.warn(`⚠️ Error al cerrar sesión de ${phone}:`, e);
      }
    }

    // Elimina la carpeta de autenticación
    const authPath = path.join(__dirname, '..', '..', 'auth', phone);
    try {
      await fs.rm(authPath, { recursive: true, force: true });
      this.logger.info(`🧹 Carpeta de sesión eliminada: ${authPath}`);
    } catch (e) {
      this.logger.warn(
        `⚠️ No se pudo eliminar la carpeta de sesión ${phone}:`,
        e,
      );
    }

    // Elimina del mapa en memoria
    delete this.sessions[phone];
    if ('sessionStates' in this) {
      delete this.sessionStates[phone];
    }
  }
}
