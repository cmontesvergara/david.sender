import { WhatsappPath } from '@/common/constants/whatsapp-path.enum';
import { getLoggerWithRequestContext } from '@/common/logger/request-logger.helper';
import * as fs from 'fs/promises';
import * as path from 'path';

export class FileService {
  async saveWhatsappQR(phone: string, qrBase64: string): Promise<void> {
    const qrPath = WhatsappPath.qrFile(phone);
    console.log(qrPath);
    const payload = {
      phone,
      qr: qrBase64,
      timestamp: new Date().toISOString(),
    };

    await fs.mkdir(path.dirname(qrPath), { recursive: true });
    await fs.writeFile(qrPath, JSON.stringify(payload, null, 2), 'utf-8');
  }

  async removeWhatsappSessionFiles(phone: string) {
    const qrPath = WhatsappPath.sessionDir(phone);
    const log = getLoggerWithRequestContext();
    try {
      await fs.rm(qrPath, { recursive: true, force: true });
      log.info(`⚠️ ${qrPath} eliminado`);
    } catch (e) {
      log.warn(`⚠️ No se pudo eliminar ${qrPath}:`, e);
    }
  }
}
