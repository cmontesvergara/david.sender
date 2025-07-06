import { Module } from '@nestjs/common';
import { ChatModule } from 'src/infrastructure/chat/chat.module';
import { CreateChatScene } from '../../adapters/in/telegram/scenes/create-chat/create-chat.scene';
import { CreateChatUpdate } from '../../adapters/in/telegram/scenes/create-chat/create-chat.update';
import { MenuUpdate } from '../../adapters/in/telegram/scenes/menu/menu.update';

@Module({
  imports: [ChatModule],
  providers: [CreateChatUpdate, CreateChatScene, MenuUpdate],
})
export class ScenesModule {}
