// src/utils/logger.ts
import pino from 'pino';
const logPath = process.env.LOG_PATH || '/tmp/notibot-logs/';

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
          destination: `${logPath}${new Date().toISOString().slice(0, 10)}.log`,
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
