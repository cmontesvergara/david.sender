// src/common/logger/logger.service.ts
import { Injectable } from '@nestjs/common';
import { getLoggerWithRequestContext } from './request-logger.helper';

@Injectable()
export class PinoLoggerService {
  info(message: any, ...args: any[]) {
    this.getContext().info(message, ...args);
  }

  warn(message: any, ...args: any[]) {
    this.getContext().warn(message, ...args);
  }

  error(message: any, ...args: any[]) {
    this.getContext().error(message, ...args);
  }

  debug(message: any, ...args: any[]) {
    this.getContext().debug(message, ...args);
  }

  trace(message: any, ...args: any[]) {
    this.getContext().trace(message, ...args);
  }
  private getContext() {
    return getLoggerWithRequestContext();
  }

  // Puedes incluir otros métodos como `child()` si los necesitas
}
