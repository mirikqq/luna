import { PrismaLuna } from ".."
import { Events } from "../constants"
import { InlineKeyboard, type Context } from "grammy"

export const sendSubscriptionMessage = async (ctx: Context, replaceMessageId?: number) => {
	const keyboard = new InlineKeyboard()
		.text("⭐ Добавить подписку (на устройство) ⭐", Events.my_devices)
		.row()
		.text("⭐ Удалить подписку (на устройство) ⭐", Events.my_devices)
		.row()
		.text("🏠 Главное меню 🏠", Events.start)
		.text("🛠️ Обновить конфигурацию 🛠️", Events.help)

	const user = await PrismaLuna.user.findFirst({ where: { id: ctx.chat!.id.toString() } })
	const activeSubscriptions = await PrismaLuna.subscription.findMany({
		where: {
			userID: user?.id,
		},
	})

	let message

	if (activeSubscriptions.length === 0) {
		message = `У Вас нет активных подписок 🥺\n`
	} else {
		message = activeSubscriptions
	}

	if (replaceMessageId) {
		await ctx.api.editMessageText(
			ctx.chat!.id,
			replaceMessageId,
			`Добро пожаловать на lunavpn, ${user?.name || "аноним :)"}!\n\n${message}`,
			{
				reply_markup: keyboard,
			},
		)
		return {
			message_id: replaceMessageId,
		}
	}

	return await ctx.reply(
		`Добро пожаловать на lunavpn, ${user?.name || "аноним :)"}!\n\n${message}`,
		{
			reply_markup: keyboard,
		},
	)
}
