import { Bot, InlineKeyboard, InputFile } from "grammy"
import { sendMenuMessage } from "../messages/menu"
import { Events } from "../constants"
import { createUser } from "../services/createUser"
import path from "path"
import { PrismaLuna } from ".."
import { sendHelpMessage } from "../messages/help"

let isUser = false

export function registerCommands(bot: Bot) {
	bot.command("menu", async (ctx) => {
		await sendMenuMessage(ctx)
	})

	bot.command("start", async (ctx) => {
		const mainImagePath = path.resolve(__dirname, "../public/main.jpg")
		const keyboard = new InlineKeyboard().text("🌒 Подключить впн 🌒", Events.start)

		if (!isUser) {
			const user = await PrismaLuna.user.findFirst({
				where: { id: ctx.chat.id.toString() },
			})
			if (user?.id) {
				isUser = true
			} else {
				await createUser({ id: ctx.chat.id.toString(), name: ctx.chat.first_name || "" })
			}
		}

		await ctx.replyWithPhoto(new InputFile(mainImagePath), {
			caption: `Салют, ${
				ctx.chat.first_name ?? "Аноним :)"
			}\n\nРады видеть Вас на просторах локального общества, в котором нет каких-либо ограничений!`,
			reply_markup: keyboard,
		})
	})

	bot.command("help", async (ctx) => {
		await sendHelpMessage(ctx)
	})
}
