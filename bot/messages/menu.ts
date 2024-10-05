import { PrismaLuna } from ".."
import { Events } from "../constants"
import { InlineKeyboard, type Context } from "grammy"

export const sendMenuMessage = async (ctx: Context, replaceMessageId?: number) => {
	const keyboard = new InlineKeyboard()
		.text("⭐ Мои подписки ⭐", Events.my_devices)
		.row()
		.text("🤝 Пригласить друга 🤝", Events.referal)
		.text("💬 Помощь 💬", Events.help)

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
		message = `Количество активных подписок ${activeSubscriptions.length} - Подробнее в "Мои подписки"`
	}

	const newSubscritption = `Чтобы добавить новое устройство нажмите на "Мои подписки"`

	const referalMessage = "Приводите друзей и получайте бесплатные дни на Вашу подписку!"

	if (replaceMessageId) {
		try {
			await ctx.api.editMessageText(
				ctx.chat!.id,
				replaceMessageId,
				`Добро пожаловать на lunavpn, ${
					user?.name || "аноним :)"
				}!\n\n${message}\n\n${newSubscritption}\n\n${referalMessage}`,
				{
					reply_markup: keyboard,
				},
			)
		} catch (e) {
			await ctx.reply(
				`Добро пожаловать на lunavpn, ${
					user?.name || "аноним :)"
				}!\n\n${message}\n\n${newSubscritption}\n\n${referalMessage}`,
				{
					reply_markup: keyboard,
				},
			)
		}
		return {
			message_id: replaceMessageId,
		}
	}

	return await ctx.reply(
		`Добро пожаловать на lunavpn, ${
			user?.name || "аноним :)"
		}!\n\n${message}\n\n${newSubscritption}\n\n${referalMessage}`,
		{
			reply_markup: keyboard,
		},
	)
}
