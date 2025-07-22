import * as path from 'path';

export enum WhatsappPaths {
  BASE = 'src/infrastructure/whatsapp/auth',
}

export const WhatsappPath = {
  AUTH_ROOT: path.join(process.cwd(), WhatsappPaths.BASE),

  sessionDir: (phone: string) =>
    path.join(process.cwd(), WhatsappPaths.BASE, phone),

  qrFile: (phone: string) =>
    path.join(process.cwd(), WhatsappPaths.BASE, phone, `qr-${phone}.json`),

  credsDir: (phone: string) => path.join(WhatsappPath.sessionDir(phone)),
};
