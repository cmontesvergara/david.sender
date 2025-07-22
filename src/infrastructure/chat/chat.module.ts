/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Module } from '@nestjs/common';
import { CreateChatUseCase } from 'application/use-cases/create-chat.use-case';
import { ChatRepository } from 'domain/interfaces/chat-repository.interface';

@Module({
  imports: [],
  providers: [
    {
      provide: CreateChatUseCase,
      useFactory: (chatRepo: ChatRepository) => new CreateChatUseCase(chatRepo),
      inject: ['ChatRepository'],
    },
  ],
  exports: [CreateChatUseCase],
})
export class ChatModule {}
