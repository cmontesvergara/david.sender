import { Injectable } from '@nestjs/common';
import { Chat } from '../../domain/entities/chat.entity';
import { ChatRepository } from '../../domain/interfaces/chat-repository.interface';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaChatRepository implements ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async exists(phone: string): Promise<boolean> {
    const chat = await this.prisma.chat.findUnique({ where: { phone } });
    return !!chat;
  }
  async getId(phone: string): Promise<bigint | null> {
    const chat = await this.prisma.chat.findUnique({ where: { phone } });
    return chat ? chat.id : null;
  }

  async create(chat: Chat): Promise<void> {
    await this.prisma.chat.create({
      data: {
        id: chat.id,
        phone: chat.phone,
        type: chat.type,
        title: chat.title,
        username: chat.username,
        firstName: chat.firstName,
        lastName: chat.lastName,
      },
    });
  }

  async linkToEvent(chatId: bigint, eventId: number): Promise<void> {
    await this.prisma.chatOnEvent.create({
      data: { chatId, eventId },
    });
  }
}
