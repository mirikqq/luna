import { Bot } from "grammy"
import { Device, device, Events } from "../constants"
import { sendSubscriptionsMessage } from "../messages/subscriptions"
import { sendMenuMessage } from "../messages/menu"
import { sendHelpMessage } from "../messages/help"
import { sendConfigMessage } from "../messages/configurationLink"
import { sendAddDevice } from "../messages/addDevice"
import { sendPayment } from "../messages/payment"
import { createSubscription } from "../services/createSubscription"

export const registerEvents = (bot: Bot) => {
	bot.on("callback_query:data", async (ctx) => {
		if (ctx.callbackQuery.data === Events.my_devices) {
			await sendSubscriptionsMessage(ctx, ctx.callbackQuery.message?.message_id || undefined)
		}
		if (ctx.callbackQuery.data === Events.start) {
			await sendMenuMessage(ctx, ctx.callbackQuery.message?.message_id || undefined)
		}
		if (ctx.callbackQuery.data === Events.help) {
			await sendHelpMessage(ctx, ctx.callbackQuery.message?.message_id || undefined)
		}
		if (ctx.callbackQuery.data.startsWith("subscription")) {
			await sendConfigMessage(
				ctx.callbackQuery.data.split("=")[1],
				ctx,
				ctx.callbackQuery.message?.message_id || undefined,
			)
		}
		if (ctx.callbackQuery.data === Events.add_device) {
			await sendAddDevice(ctx, ctx.callbackQuery.message?.message_id || undefined)
		}
		if (ctx.callbackQuery.data.startsWith("device")) {
			await sendPayment(ctx, ctx.callbackQuery.message?.message_id || undefined)
			await ctx.reply('status: "completed"')
			// const subId = await createSubscription(
			// 	"1month",
			// 	ctx.chat!.id.toString(),
			// 	ctx.callbackQuery.data.split("=")[1] as unknown as Device,
			// )
			// if (!subId.success) return ctx.reply(subId.msg)
			// await sendConfigMessage(
			// 	subId.msg,
			// 	ctx,
			// 	ctx.callbackQuery.message?.message_id || undefined,
			// 	ctx.callbackQuery.data.split("=")[1] as unknown as Device,
			// )
		}
	})
}
