import { WhatsappPath } from '@/common/constants/whatsapp-path.enum';
import { getLoggerWithRequestContext } from '@/common/logger/request-logger.helper';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class FileService {
  constructor(private readonly redisService: RedisService) { }

  async saveWhatsappQR(phone: string, qrBase64: string): Promise<void> {
    const redisClient = this.redisService.getClient();
    const qrKey = `baileys:qr:${phone}`;
    const payload = {
      phone,
      qr: qrBase64,
      timestamp: new Date().toISOString(),
    };

    // Almacenar en Redis con TTL de 10 minutos (600 segundos)
    await redisClient.set(qrKey, JSON.stringify(payload), 'EX', 600);
    console.log(`QR stored in Redis for ${phone} with key ${qrKey}`);

    // Opcional: Mantener creación de directorio si otros archivos lo necesitan, 
    // pero ya no guardaremos el JSON localmente.
    // const qrPath = WhatsappPath.qrFile(phone);
    // await fs.mkdir(path.dirname(qrPath), { recursive: true });
    // await fs.writeFile(qrPath, JSON.stringify(payload, null, 2), 'utf-8');
  }

  async removeWhatsappSessionFiles(phone: string) {
    const qrPath = WhatsappPath.sessionDir(phone);
    const log = getLoggerWithRequestContext();
    try {
      // Eliminar archivos locales
      await fs.rm(qrPath, { recursive: true, force: true });
      log.info(`⚠️ ${qrPath} eliminado`);

      // Eliminar QR de Redis
      const redisClient = this.redisService.getClient();
      await redisClient.del(`baileys:qr:${phone}`);
      log.info(`⚠️ baileys:qr:${phone} eliminado de Redis`);
    } catch (e) {
      log.warn(`⚠️ No se pudo eliminar ${qrPath} o llave de Redis:`, e);
    }
  }
}
