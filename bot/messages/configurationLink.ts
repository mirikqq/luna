import { PrismaLuna } from ".."
import { type Device, Events } from "../constants"
import { InlineKeyboard, type Context } from "grammy"

export const sendConfigMessage = async (
	subscriptionId: string,
	ctx: Context,
	replaceMessageId?: number,
	helpType?: Device,
) => {
	const user = await PrismaLuna.user.findFirst({ where: { id: ctx.chat!.id.toString() } })
	const activeSubscriptions = await PrismaLuna.subscription.findMany({
		where: {
			userID: user?.id,
		},
	})

	const keyboard = new InlineKeyboard()

	const config = activeSubscriptions.find((el) => el.id == subscriptionId)

	if (helpType) {
		keyboard
			.text(
				`💬 Инструкция для подключения ${String(helpType)} 💬`,
				Events[`help_${helpType}` as keyof typeof Events],
			)
			.row()
	}

	keyboard.text("🏠 Главное меню 🏠", Events.start).row()

	if (replaceMessageId) {
		try {
			await ctx.api.editMessageText(
				ctx.chat!.id,
				replaceMessageId,
				`Вот твоя ссылка vless для настройки vpn подключения, устройство ${config?.device} Vless\n\nСкопируй ссылку и подключайся: 👇\n\`\`\`${config?.vless_config}\`\`\``,
				{
					parse_mode: "MarkdownV2",
					reply_markup: keyboard,
				},
			)
		} catch (e) {
			await ctx.reply(
				`Вот твоя ссылка vless для настройки vpn подключения, устройство ${config?.device} Vless\n\nСкопируй ссылку и подключайся: 👇 \n\`\`\`${config?.vless_config}\`\`\``,
				{
					reply_markup: keyboard,
					parse_mode: "MarkdownV2",
				},
			)
		}
		return {
			message_id: replaceMessageId,
		}
	}

	return await ctx.reply(
		`Вот твоя ссылка vless для настройки vpn подключения, устройство ${config?.device} Vless\n\nСкопируй ссылку и подключайся: 👇\n\`\`\`${config?.vless_config}\`\`\``,
		{
			parse_mode: "MarkdownV2",
			reply_markup: keyboard,
		},
	)
}
