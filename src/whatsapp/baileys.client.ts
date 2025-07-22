/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Boom } from '@hapi/boom';
import makeWASocket, {
  DisconnectReason,
  proto,
  useMultiFileAuthState,
  WASocket,
} from '@whiskeysockets/baileys';
import * as qrcode from 'qrcode-terminal';
import { TelegramMessageFormatter } from 'src/shared/helpers/telegram-message-formatter';
import { WhatsappGateway } from './whatsapp.gateway';

let sockInstance: WASocket | null = null;
let currentQR: string | null = null;

export async function startBaileys(
  gateway: WhatsappGateway,
): Promise<WASocket> {
  const { state, saveCreds } = await useMultiFileAuthState('auth');

  const sock = makeWASocket({
    auth: state,
  });
  sockInstance = sock;
  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('📲 Escanea este código QR para conectar WhatsApp:');
      qrcode.generate(qr, { small: true }); // ✅ ¡Aquí sí lo imprime!
      currentQR = await qrcode.toDataURL(qr);
    }

    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log('connection closed. Reconnecting...', shouldReconnect);
      if (shouldReconnect) await startBaileys(gateway);
    } else if (connection === 'open') {
      console.log('✅ WhatsApp conectado');
      currentQR = null;
    }
  });

  sock.ev.on(
    'messages.upsert',
    async (msg: { messages: proto.IWebMessageInfo[] }) => {
      const m = msg.messages[0];
      if (!m.message || m.key.fromMe) return;

      const sender: any = m.key.remoteJid;
      const text =
        m.message?.conversation || m.message?.extendedTextMessage?.text;

      console.log(`📩 Mensaje de ${sender}: ${text}`);

      gateway.sendToClient('new-whatsapp-message', { sender, text });

      // Respuesta automática (opcional)
      await sock.sendMessage(sender, {
        text: '👋 Hola, recibimos tu mensaje.',
      });
    },
  );

  return sock;
}

export function getCurrentQR(): string | null {
  return currentQR;
}

export async function sendTextMessage(jid: string, payload: any) {
  if (!sockInstance) throw new Error('WhatsApp not initialized');

  const labelMap = {
    otp: 'Código',
    username: 'Usuario',
    session: 'Sesión',
    expiresIn: 'Expira en',
    url: 'Enlace de verificación',
  };

  const formatter = new TelegramMessageFormatter(
    { phone: jid, payload: payload },
    labelMap,
    true,
  );

  const md = formatter.toMarkdown();

  await sockInstance.sendMessage(`57${jid}@s.whatsapp.net`, {
    text: md,
  });
}
