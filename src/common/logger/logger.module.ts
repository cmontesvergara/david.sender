// src/common/logger/logger.module.ts
import { Module } from '@nestjs/common';
import { PinoLoggerService } from './logger.service';

@Module({
  providers: [PinoLoggerService],
  exports: [PinoLoggerService],
})
export class LoggerModule {}
