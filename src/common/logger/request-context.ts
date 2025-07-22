// src/common/logger/request-context.ts
import { AsyncLocalStorage } from 'async_hooks';

interface RequestContext {
  requestId: string;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();
