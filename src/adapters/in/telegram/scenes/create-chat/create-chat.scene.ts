import { Action, Ctx, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { CreateChatUseCase } from 'src/application/use-cases/create-chat.use-case';
import { Chat } from 'src/domain/entities/chat.entity';
import {
  Chat as ChatType,
  Message,
  Update,
} from 'telegraf/typings/core/types/typegram';
import { SceneContext } from 'telegraf/typings/scenes';

export const CREATE_CHAT_SCENE_ID = 'vincular'; // ID de la escena
@Scene(CREATE_CHAT_SCENE_ID)
export class CreateChatScene {
  constructor(private createChatUseCase: CreateChatUseCase) {}
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply('📱 Procederas a compartir tu número de teléfono:', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'CANCELAR', callback_data: 'cancel' },
            { text: 'ACEPTAR', callback_data: 'accept' },
          ],
          [],
        ],
      },
    });
  }

  @Action(/accept/)
  async onAccept(
    @Ctx() ctx: SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    await ctx.answerCbQuery(
      '✅ Al aceptar, autorizas el tratamiento de tus datos personales y aceptas los términos y condiciones.',
      {
        show_alert: true,
      },
    );
    await ctx.reply('Presiona el boton ⬇️⬇️⬇️ ', {
      reply_markup: {
        keyboard: [[{ text: '📤 Enviar mi número', request_contact: true }]],
        one_time_keyboard: true,
      },
    });
  }
  @Action(/cancel/)
  async onCancel(
    @Ctx() ctx: SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    await ctx.answerCbQuery('Proceso cancelado. ❌', {
      show_alert: true,
    });
    return ctx.scene.leave();
  }
  @On('contact')
  async onContact(
    ctx: SceneContext & { message: Message.ContactMessage } & {
      chat: ChatType.PrivateChat;
    },
  ) {
    const contact = ctx.message.contact;
    const fromId = ctx.from?.id;

    if (contact.user_id === fromId) {
      const chatId = BigInt(ctx.chat.id);
      const type = ctx.chat.type;
      const username = ctx.chat.username;

      const phone = contact.phone_number;
      const firstName = contact.first_name;
      const lastName = contact.last_name;

      const chat = new Chat({
        id: chatId,
        type,
        phone,
        title: '',
        username,
        firstName,
        lastName,
      });

      try {
        await this.createChatUseCase.execute(chat);
      } catch (error) {
        console.error('❌ Error al crear chat:', error);
        await ctx.reply('❌ Ocurrió un error en la vinculación.');
      }

      await ctx.reply(`✅ Número verificado, vinculación exitosa `, {
        reply_markup: {
          remove_keyboard: true,
        },
      });
      return ctx.scene.leave();
    } else {
      await this.enter(ctx); // Reingresa a la escena para intentar de nuevo
    }
  }
}
