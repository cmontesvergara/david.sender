/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { WhatsappPath } from '@/common/constants/whatsapp-path.enum';
import { Boom } from '@hapi/boom';
import makeWASocket, {
  DisconnectReason,
  proto,
  useMultiFileAuthState,
  WASocket,
} from '@whiskeysockets/baileys';
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
  ) {}

  public async start(): Promise<void> {
    const { state, saveCreds } = await useMultiFileAuthState(
      WhatsappPath.credsDir(this.phone),
    );

    this.sock = makeWASocket({ auth: state });

    this.onNewSocket(this.sock);
    this.sock.ev.on('creds.update', saveCreds);
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
    }
  }

  private async handleConnectionUpdate(update: any): Promise<void> {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
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

    this.log.info({ sender, text }, `📩 Mensaje recibido`);
    this.gateway.sendToClient('new-whatsapp-message', { sender, text });
  }

  public async sendText(jid: string, message: string): Promise<void> {
    await this.sock.sendMessage(jid, { text: message });
  }
}
