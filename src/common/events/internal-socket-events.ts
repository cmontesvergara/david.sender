// events.ts
import { EventEmitter } from 'events';

export const internalSocketEvents = new EventEmitter();

export enum WppSocketEvents {
  SessionDisconnected = 'wpp-session-disconnect',
  SessionAttemptsExceeded = 'session-attempts-exceeded',
  HasUserResponse = 'has-user-response',
}
