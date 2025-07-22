// src/common/logger/request-logger.ts
import { v4 as uuidv4 } from 'uuid';
import { pinoLogger } from './pino.logger';
import { requestContext } from './request-context';

export function requestLoggerMiddleware(req, res, next) {
  const requestId = uuidv4();
  const startTime = Date.now();

  const requestLogger = pinoLogger.child({
    requestId,
    method: req.method,
    url: req.originalUrl,
  });

  req.log = requestLogger;

  requestContext.run({ requestId }, () => {
    requestLogger.info('🟢 Inicio de petición');

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      requestLogger.info(
        { statusCode: res.statusCode, duration },
        '✅ Fin de petición',
      );
    });

    next();
  });
}
