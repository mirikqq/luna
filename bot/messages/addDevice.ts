import { PrismaLuna } from ".."
import { InlineKeyboard, type Context } from "grammy"
import { device } from "../constants"

export const sendAddDevice = async (ctx: Context, replaceMessageId?: number) => {
	const keyboard = new InlineKeyboard()
		.text("🖥️ Телевизор 🖥️", `device=${device.tv}`)
		.row()
		.text("📱 IOS 📱", `device=${device.ios}`)
		.text("📱 Android 📱", `device=${device.android}`)
		.text("💻 Windows 💻", `device=${device.windows}`)
		.text("💻 MacOS 💻", `device=${device.macos}`)

	if (replaceMessageId) {
		try {
			await ctx.api.editMessageText(
				ctx.chat!.id,
				replaceMessageId,
				`На какое устройство вы хотите приобрести подписку`,
				{
					reply_markup: keyboard,
					parse_mode: "HTML",
				},
			)
		} catch (e) {
			await ctx.reply(`На какое устройство вы хотите приобрести подписку`, {
				reply_markup: keyboard,
			})
		}
		return {
			message_id: replaceMessageId,
		}
	}

	return await ctx.reply(`На какое устройство вы хотите приобрести подписку `, {
		reply_markup: keyboard,
	})
}
