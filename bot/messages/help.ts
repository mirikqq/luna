import { InlineKeyboard, type Context } from "grammy"
import { Events } from "../constants"

export const sendHelpMessage = async (ctx: Context, replaceMessageId?: number) => {
	const keyboard = new InlineKeyboard()
		.text("📱 Помощь с ios 📱", Events.help_ios)
		.row()
		.text("📱 Помощь с Android 📱", Events.help_android)
		.row()
		.text("💻 Помощь с MacOs 💻", Events.help_macos)
		.row()
		.text("💻 Помощь с Windows 💻", Events.help_windows)
		.row()
		.text("🖥️ Помощь телевизорами (android, smart) 🖥️", Events.help_tv)
		.row()
		.text("🏠 Главное меню 🏠", Events.start)
		.row()

	if (replaceMessageId) {
		try {
			await ctx.api.editMessageText(
				ctx.chat!.id,
				replaceMessageId,
				`Выберите Ваше устройство`,
				{
					reply_markup: keyboard,
				},
			)
		} catch (e) {
			return await ctx.reply(`Выберите Ваше устройство`, {
				reply_markup: keyboard,
			})
		}
		return {
			message_id: replaceMessageId,
		}
	}

	return await ctx.reply(`Выберите Ваше устройство`, {
		reply_markup: keyboard,
	})
}
