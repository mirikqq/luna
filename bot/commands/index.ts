import { Bot, InlineKeyboard, InputFile } from "grammy"
import { sendMenuMessage } from "../messages/menu"
import { Events } from "../constants"
import { createUser } from "../services/createUser"
import path from "path"
import { PrismaLuna } from ".."
import { sendHelpMessage } from "../messages/help"
import { device } from "../constants"
import axios from "axios"
import { env } from "bun"

export function registerCommands(bot: Bot) {
	bot.command("menu", async (ctx) => {
		await sendMenuMessage(ctx)
	})

	bot.command("start", async (ctx) => {
		const currentReferalCode = ctx.message?.text.split(" ")[1] ?? ""
		const mainImagePath = path.resolve(__dirname, "../public/main.jpg")
		const keyboard = new InlineKeyboard().text("🌒 Подключить впн 🌒", Events.start)

		const user = await PrismaLuna.user.findFirst({
			where: { id: ctx.chat.id.toString() },
		})
		if (!user?.id) {
			await createUser({ id: ctx.chat.id.toString(), name: ctx.chat.first_name || "" })
		}

		await ctx.replyWithPhoto(new InputFile(mainImagePath), {
			caption: `Салют, ${
				ctx.chat.first_name ?? "Аноним :)"
			}\n\nРады видеть Вас на просторах локального общества, в котором нет каких-либо ограничений!`,
			reply_markup: keyboard,
		})

		if (currentReferalCode) {
			const referer = await PrismaLuna.user.findFirst({
				where: { id: currentReferalCode },
			})

			if (!referer?.isReferalCodeUsed) {
				const referalKeyboards = new InlineKeyboard()
					.text("🖥️ Телевизор 🖥️", `referalDevice=${device.tv}`)
					.row()
					.text("📱 IOS 📱", `referalDevice=${device.ios}`)
					.text("📱 Android 📱", `referalDevice=${device.android}`)
					.text("💻 Windows 💻", `referalDevice=${device.windows}`)
					.text("💻 MacOS 💻", `referalDevice=${device.macos}`)

				await ctx.replyWithPhoto(new InputFile(mainImagePath), {
					caption: `Вы перешли по реферальной ссылке, Вам доступна пробная подписка на 5 дней, выберете устройство`,
					reply_markup: referalKeyboards,
				})
			}
		}
	})

	bot.command("help", async (ctx) => {
		await sendHelpMessage(ctx)
	})

	bot.command("status", async (ctx) => {
		try {
			const { status } = await axios.get(env.SERVER_API, {
				timeout: 10000,
			})

			console.log(status)

			if (status === 200) {
				await ctx.reply("Статус VPN - Доступен ✅")
			} else {
				await ctx.reply("Статус VPN - Недоступен 🚫")
			}
		} catch (e) {
			await ctx.reply("Статус VPN - Недоступен 🚫")
		}
	})
}
