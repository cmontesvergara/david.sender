import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { PinoLoggerService } from '../../common/logger/logger.service';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLoggerService,
  ) { }

  async onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST');
    const port = this.configService.get<number>('REDIS_PORT');
    const password = this.configService.get<string>('REDIS_PASSWORD');

    this.client = new Redis({
      host,
      port,
      password,
      maxRetriesPerRequest: null,
    });

    this.client.on('connect', () => {
      this.logger.info('🟢 Conectado a Redis (RedisService) exitosamente.');
      // Prueba de escritura rápida para verificar permisos
      this.client.set('test_connection', 'ok_ready')
        .then(() => this.logger.info('✅ Redis connection test: write successful.'))
        .catch(err => {
          this.logger.error('🔴 Error de escritura en Redis (permisos?):', err);
        });
    });

    this.client.on('error', (err) => {
      this.logger.error('🔴 Error de conexión a Redis (RedisService):', err);
    });
  }

  onModuleDestroy() {
    this.client.disconnect();
  }

  getClient(): Redis {
    return this.client;
  }
}
