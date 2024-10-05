import { Context, InlineKeyboard } from "grammy"

export const sendPayment = async (ctx: Context, replaceMessageId?: number) => {
	ctx.replyWithInvoice("Test payment", "test sub", "test", "XTR", [
		{ label: "1month", amount: 1 },
	])
	// if (replaceMessageId) {
	// 	try {
	// 		await ctx.replyWithInvoice("Test payment", "test sub", "test", "RUB", [
	// 			{ label: "1month", amount: 200 },
	// 		])
	// 		await ctx.api.editMessageText(
	// 			ctx.chat!.id,
	// 			replaceMessageId,
	// 			`Оплата should_be_procced`,
	// 			{
	// 				parse_mode: "MarkdownV2",
	// 			},
	// 		)
	// 	} catch (e) {
	// 		await ctx.reply(`Оплата should_be_procced`, {
	// 			parse_mode: "MarkdownV2",
	// 		})
	// 	}
	// 	return {
	// 		message_id: replaceMessageId,
	// 	}
	// }

	// return await ctx.reply(`Оплата should_be_procced`, {
	// 	parse_mode: "MarkdownV2",
	// })
}
