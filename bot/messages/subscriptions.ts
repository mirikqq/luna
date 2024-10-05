import { PrismaLuna } from ".."
import { Events } from "../constants"
import { InlineKeyboard, type Context } from "grammy"

export const sendSubscriptionsMessage = async (ctx: Context, replaceMessageId?: number) => {
	const keyboard = new InlineKeyboard()

	const user = await PrismaLuna.user.findFirst({ where: { id: ctx.chat!.id.toString() } })
	const activeSubscriptions = await PrismaLuna.subscription.findMany({
		where: {
			userID: user?.id,
		},
	})

	let message

	if (activeSubscriptions.length === 0) {
		message = `У Вас нет активных подписок 🥺`
	} else {
		message = activeSubscriptions.map((subscription) => {
			if (subscription.active_up_to === null) return `У Вас нет активных подписок`
			const day = String(subscription.active_up_to!.getDate()).padStart(2, "0")
			const month = String(subscription.active_up_to!.getMonth() + 1).padStart(2, "0")
			const year = subscription.active_up_to!.getFullYear()

			keyboard
				.text(
					`🚀 Подписка #${subscription.id.split("-")[0]} - ${subscription.device} 🚀`,
					`subscription=${subscription.id}`,
				)
				.row()

			return `<em>Подписка #${
				subscription.id.split("-")[0]
			} | активна до ${day}.${month}.${year}</em> | ${subscription.device}\n`
		})
	}

	keyboard
		.text("⭐ Добавить подписку (на устройство) ⭐", Events.add_device)
		.row()
		.text("🏠 Главное меню 🏠", Events.start)
		.row()

	const subscriptionManage =
		activeSubscriptions.length > 0
			? "Управление подпиской доступно на ее странице, нажмите на нужную подписку для перехода\n\nВаши конфигурации:"
			: ""

	if (replaceMessageId) {
		try {
			await ctx.api.editMessageText(
				ctx.chat!.id,
				replaceMessageId,
				`<strong>Ваши подписки:</strong>\n${message}\n${subscriptionManage}`,
				{
					reply_markup: keyboard,
					parse_mode: "HTML",
				},
			)
		} catch (e) {
			await ctx.reply(`<strong>Ваши подписки:</strong>\n${message}\n${subscriptionManage}`, {
				reply_markup: keyboard,
			})
		}
		return {
			message_id: replaceMessageId,
		}
	}

	return await ctx.reply(`<strong>Ваши подписки:</strong>\n${message}\n${subscriptionManage}`, {
		reply_markup: keyboard,
	})
}
