import { Injectable } from '@nestjs/common';
import { Chat } from '../../domain/entities/chat.entity';
import { ChatRepository } from '../../domain/interfaces/chat-repository.interface';

@Injectable()
export class CreateChatUseCase {
  constructor(private readonly chatRepo: ChatRepository) {}

  async execute(chat: Chat) {
    const exists = await this.chatRepo.exists(chat.phone);
    if (exists) {
      return;
    }
    await this.chatRepo.create(new Chat(chat));
  }
}
