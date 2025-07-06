import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from '../../interfaces/context.interface';
import { CREATE_CHAT_SCENE_ID } from './create-chat.scene';

@Update()
export class CreateChatUpdate {
  constructor() {}
  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply('👋 ¡Hola! Usa /menu para ver opcionesss.');
    await ctx.scene.enter('vincular');
  }
  @Command(CREATE_CHAT_SCENE_ID)
  async onVincular(@Ctx() ctx: Context) {
    console.log('🧭 Entrando a escena de vinculación', ctx?.chat);
    await ctx.scene.enter(CREATE_CHAT_SCENE_ID);
  }
}
