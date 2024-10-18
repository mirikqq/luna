import { User } from "@prisma/client"
import { PrismaLuna } from ".."
import { type Device, Events } from "../constants"
import { InlineKeyboard, type Context } from "grammy"

export const createReferalSubscription = async (ctx: Context, replaceMessageId?: number) => {
	await PrismaLuna.user.update({
		where: {
			id: ctx.chat?.id.toString(),
		},
		data: {
			isReferalCodeUsed: true,
		},
	})
}
