// src/common/logger/request-logger.helper.ts
import { pinoLogger } from './pino.logger';
import { requestContext } from './request-context';

export function getLoggerWithRequestContext() {
  const store = requestContext.getStore();
  return store ? pinoLogger.child({ requestId: store.requestId }) : pinoLogger;
}
