import { PrismaLuna } from ".."
import { Events } from "../constants"
import { InlineKeyboard, type Context } from "grammy"

export const sendSubscriptionMessage = async (ctx: Context, replaceMessageId?: number) => {
	const keyboard = new InlineKeyboard()

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
			.map((subscription) => {
				const day = String(subscription.active_up_to!.getDate()).padStart(2, "0")
				const month = String(subscription.active_up_to!.getMonth() + 1).padStart(2, "0")
				const year = subscription.active_up_to!.getFullYear()

				keyboard.text(`🚀 Подписка #${subscription.id} 🚀`).row()

				return `<em>Подписка #${subscription.id} | активна до ${day}.${month}.${year}</em>`
			})
			.join("\n")
	}

	keyboard
		.text("⭐ Добавить подписку (на устройство) ⭐", Events.my_devices)
		.row()
		.text("🏠 Главное меню 🏠", Events.start)
		.row()

	if (replaceMessageId) {
		await ctx.api.editMessageText(
			ctx.chat!.id,
			replaceMessageId,
			`<strong>Ваши подписки:</strong>\n${message}\n\nУправление подпиской доступно на ее странице, нажмите на нужную подписку для перехода`,
			{
				reply_markup: keyboard,
				parse_mode: "HTML",
			},
		)
		return {
			message_id: replaceMessageId,
		}
	}

	return await ctx.reply(`${message}`, {
		reply_markup: keyboard,
	})
}
