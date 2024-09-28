import { Bot } from "grammy"
import { Events } from "../constants"
import { sendSubscriptionMessage } from "../messages/subscription"
import { sendMenuMessage } from "../messages/menu"

let messageId: number

export const registerEvents = (bot: Bot) => {
	bot.on("callback_query:data", async (ctx) => {
		if (ctx.callbackQuery.data === Events.my_devices) {
			messageId = (await sendSubscriptionMessage(ctx, messageId)).message_id
		}
		if (ctx.callbackQuery.data === Events.start) {
			messageId = (await sendMenuMessage(ctx, messageId)).message_id
		}
	})
}
