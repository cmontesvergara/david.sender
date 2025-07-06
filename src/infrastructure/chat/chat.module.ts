import { Module } from '@nestjs/common';
import { CreateChatUseCase } from 'src/application/use-cases/create-chat.use-case';
import { ChatRepository } from 'src/domain/interfaces/chat-repository.interface';

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
