// src/utils/logger.ts
import * as fs from 'fs';
import pino from 'pino';

const logDir = process.env.LOG_PATH || './src/logs/';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
export const pinoLogger = pino({
  transport: {
    // target:   'pino-pretty',
    targets: [
      {
        target: 'pino-pretty',
      },
      {
        target: 'pino/file',
        options: {
          destination: `${logDir}${new Date().toISOString().slice(0, 10)}.log`,
        },
        level: 'debug',
      },
    ],
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
  base: undefined,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});
