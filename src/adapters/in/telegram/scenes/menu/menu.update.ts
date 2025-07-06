import { Command, Ctx, Update } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';

@Update()
export class MenuUpdate {
  @Command('menu')
  async onMenu(@Ctx() ctx: SceneContext) {
    console.log('Contexto actual:', ctx);
    await ctx.reply(
      `📋 Opciones disponibles:
        /vincular - Vincularse con el bot para recibir notificaciones
        /desvincular - Desvincularse del bot
        `,
    );
  }
}
