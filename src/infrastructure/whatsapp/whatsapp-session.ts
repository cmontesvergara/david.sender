/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { WhatsappPath } from '@/common/constants/whatsapp-path.enum';
import { Boom } from '@hapi/boom';
import makeWASocket, {
  DisconnectReason,
  proto,
  WASocket,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import { useRedisAuthState } from './auth/redis-auth-state';
import Redis from 'ioredis';
import {
  internalSocketEvents,
  WppSocketEvents,
} from 'common/events/internal-socket-events';
import { getLoggerWithRequestContext } from 'common/logger/request-logger.helper';
import * as qrcode from 'qrcode';
import { FileService } from './file.service';
import { WhatsappGateway } from './whatsapp.gateway';

export class WhatsappSession {
  private sock!: WASocket;
  private log = getLoggerWithRequestContext();
  private currentReconnectAttempts = 0;
  private readonly MAX_RETRIES = 5;
  private readonly RETRY_DELAY = 3000; // ms

  constructor(
    private readonly phone: string,
    private readonly gateway: WhatsappGateway,
    private readonly onNewSocket: (sock: WASocket) => void,
    private readonly qrFileService: FileService,
    private readonly redisClient: Redis,
  ) { }

  public async start(): Promise<void> {
    const { state, saveCreds } = await useRedisAuthState(
      this.redisClient,
      this.phone,
    );

    const { version, isLatest } = await fetchLatestBaileysVersion();
    this.log.info({ version, isLatest }, 'WhatsApp Web Version fetched');

    this.sock = makeWASocket({
      auth: state,
      version,
      printQRInTerminal: false,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      logger: this.log as any, // Usar logger centralizado
    });

    this.onNewSocket(this.sock);
    this.sock.ev.on('creds.update', async () => {
      this.log.info({ phone: this.phone }, '🔄 Actualizando credenciales en Redis...');
      await saveCreds();
    });
    this.sock.ev.on('connection.update', (update) =>
      this.handleConnectionUpdate(update),
    );
    this.sock.ev.on('messages.upsert', (msg) =>
      this.handleIncomingMessage(msg),
    );
  }

  public async logout(agent: string): Promise<void> {
    if (this.sock) {
      await this.sock.logout();
      await this.qrFileService.removeWhatsappSessionFiles(agent);
      const keys = await this.redisClient.keys(`baileys:session:${agent}:*`);
      if (keys.length > 0) {
        await this.redisClient.del(...keys);
      }
    }
  }

  private async handleConnectionUpdate(update: any): Promise<void> {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      this.log.info({ phone: this.phone }, '📱 Generando nuevo QR code...');
      const qrBase64 = await qrcode.toDataURL(qr);
      await this.qrFileService.saveWhatsappQR(this.phone, qrBase64);
    }

    if (connection === 'close') {
      const error = lastDisconnect?.error as Boom;
      const statusCode = error?.output?.statusCode;

      this.log.warn(
        { phone: this.phone, statusCode },
        `Conexión cerrada para ${this.phone}`,
      );

      switch (statusCode) {
        case DisconnectReason.loggedOut:
          this.log.error(
            { phone: this.phone },
            'Sesión cerrada permanentemente (loggedOut)',
          );
          internalSocketEvents.emit(WppSocketEvents.SessionDisconnected, {
            agent: this.phone,
            status: statusCode,
            sendNotification: true,
            reason: 'Sesión cerrada permanentemente (loggedOut)',
            action: 'auth folder deleted.',
          });
          break;

        default:
          if (this.currentReconnectAttempts < this.MAX_RETRIES) {
            this.currentReconnectAttempts++;
            this.log.info(
              { phone: this.phone, attempt: this.currentReconnectAttempts },
              'Intentando reconexión...',
            );
            setTimeout(() => void this.start(), this.RETRY_DELAY);
          } else {
            this.log.error(
              { phone: this.phone },
              'Máximos intentos de reconexión alcanzados',
            );
            internalSocketEvents.emit(WppSocketEvents.SessionDisconnected, {
              agent: this.phone,
              status: statusCode,
              reason: 'Máximos intentos de reconexión alcanzados',
              action: 'delete auth folder.',
            });
          }
      }
    } else if (connection === 'open') {
      this.currentReconnectAttempts = 0;
      this.log.info(
        { phone: this.phone, connection: 'open' },
        'WhatsApp Agent Connected ✅',
      );
    }
  }

  private handleIncomingMessage(msg: {
    messages: proto.IWebMessageInfo[];
  }): void {
    const m = msg.messages[0];
    if (!m.message || m.key.fromMe) return;

    const sender = m.key.remoteJid as string;
    const text =
      m.message?.conversation || m.message?.extendedTextMessage?.text;

    this.log.info(
      { sender, text, message: m.message, timestamp: m.messageTimestamp },
      `[Mensaje recibido]`,
    );
    internalSocketEvents.emit(WppSocketEvents.HasUserResponse, {
      agent: this.phone,
      sender,
      reason: 'Send only after user interaction',
      action: 'Validate for Re-enqueued message.',
    });

    this.gateway.sendToClient('new-whatsapp-message', {
      sender,
      text,
      message: m.message,
      timestamp: m.messageTimestamp,
    });
  }

  public async sendText(jid: string, message: string): Promise<void> {
    await this.sock.sendMessage(jid, { text: message });
  }
}
