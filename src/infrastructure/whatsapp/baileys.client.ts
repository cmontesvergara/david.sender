// /* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
// /* eslint-disable @typescript-eslint/no-misused-promises */
// import { Boom } from '@hapi/boom';
// import makeWASocket, {
//   DisconnectReason,
//   proto,
//   useMultiFileAuthState,
//   WASocket,
// } from '@whiskeysockets/baileys';
// import * as qrcode from 'qrcode';
// import { WhatsappGateway } from './whatsapp.gateway';

// import {
//   internalSocketEvents,
//   WppSocketEvents,
// } from 'common/events/internal-socket-events';
// import { getLoggerWithRequestContext } from 'common/logger/request-logger.helper';
// import * as fs from 'fs/promises';
// import * as path from 'path';
// export type WppSessionDisconnectEvent = {
//   agent: string;
//   status: string;
//   reason: string;
//   action: string;
// }[];
// export async function startBaileys(
//   phone: string,
//   gateway: WhatsappGateway,
//   onNewSocket: (sock: WASocket) => void,
// ): Promise<WASocket> {
//   const log = getLoggerWithRequestContext();
//   const { state, saveCreds } = await useMultiFileAuthState(
//     `whatsapp/auth/${phone}`,
//   );
//   const sock = makeWASocket({
//     auth: state,
//   });
//   onNewSocket(sock); // Notifica al servicio
//   sock.ev.on('creds.update', saveCreds);

//   sock.ev.on('connection.update', async (update) => {
//     const { connection, lastDisconnect, qr } = update;

//     if (qr) {
//       await guardarQrEnArchivo(phone, (await qrcode.toDataURL(qr)) as string);
//     }

//     if (connection === 'close') {
//       const error = lastDisconnect?.error as Boom;
//       const statusCode = error?.output?.statusCode;

//       log.warn({ phone, statusCode }, `Conexión cerrada para ${phone}`);

//       switch (statusCode) {
//         case DisconnectReason.loggedOut:
//           log.error({ phone }, 'Sesión cerrada permanentemente (loggedOut)');
//           internalSocketEvents.emit(WppSocketEvents.SessionDisconnected, {
//             agent: phone,
//             status: statusCode,
//             reason: 'Sesión cerrada permanentemente (loggedOut)',
//             action: 'auth folder deleted.',
//           });

//           break;

//         case DisconnectReason.timedOut:
//           log.warn({ phone }, 'Tiempo de espera agotado. Reintentando...');
//           await startBaileys(phone, gateway, onNewSocket); // para reconexión
//           break;

//         default:
//           log.info({ phone, statusCode }, 'Reconectando...');
//           await startBaileys(phone, gateway, onNewSocket); // para reconexión
//           break;
//       }
//     } else if (connection === 'open') {
//       log.info(`[${phone}] WhatsApp Agent Connected ✅`);
//     }
//   });

//   sock.ev.on(
//     'messages.upsert',
//     (msg: { messages: proto.IWebMessageInfo[] }) => {
//       const m = msg.messages[0];
//       if (!m.message || m.key.fromMe) return;

//       const sender: any = m.key.remoteJid;
//       const text =
//         m.message?.conversation || m.message?.extendedTextMessage?.text;

//       log.info(`📩 Mensaje de ${sender}: ${text}`);

//       gateway.sendToClient('new-whatsapp-message', { sender, text });

//       // Respuesta automática (opcional)
//       // await sock.sendMessage(sender, {
//       //   text: ' ',
//       // });
//     },
//   );

//   return sock;
// }

// async function guardarQrEnArchivo(phone: string, qrBase64: string) {
//   const qrPath = path.join(
//     __dirname,
//     '..',
//     '..',
//     'auth',
//     `${phone}`,
//     `qr-${phone}.json`,
//   );
//   const payload = {
//     phone,
//     qr: qrBase64,
//     timestamp: new Date().toISOString(),
//   };

//   await fs.mkdir(path.dirname(qrPath), { recursive: true });
//   await fs.writeFile(qrPath, JSON.stringify(payload, null, 2), 'utf-8');
// }
