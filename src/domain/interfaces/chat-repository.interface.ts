import { Chat } from '../entities/chat.entity';

export interface ChatRepository {
  exists(phone: string): Promise<boolean>;
  getId(phone: string): Promise<bigint | null>;
  create(chat: Chat): Promise<void>;
  linkToEvent(chatId: bigint, eventId: number): Promise<void>;
}
