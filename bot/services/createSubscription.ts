import { env } from "bun"
import { useAxios } from "../modules/axiosInstance"
import { login } from "./login"
import { Device, vlessConfig } from "../constants"
import { PrismaLuna } from ".."
import { v4 as uuidv4 } from "uuid"

type Subscription = "15days" | "1month" | "3month" | "6month" | "12month"

export const createSubscription = async (
	subscriptionTime: Subscription,
	userId: string,
	device: Device,
): Promise<{ success: boolean; msg: string }> => {
	const currentTimestamp = Date.now()

	const currentDate = new Date(currentTimestamp)

	switch (subscriptionTime) {
		case "15days":
			currentDate.setMonth(currentDate.getDay() + 15)
			break
		case "1month":
			currentDate.setMonth(currentDate.getMonth() + 1)
			break
		case "3month":
			currentDate.setMonth(currentDate.getMonth() + 3)
			break
		case "6month":
			currentDate.setMonth(currentDate.getMonth() + 6)
			break
		case "12month":
			currentDate.setMonth(currentDate.getMonth() + 12)
			break
	}

	const newTimestamp = currentDate.getTime()
	const uuid = uuidv4()

	const subData = {
		id: Number(env.CLIENTS_INBOUND_ID),
		settings: JSON.stringify({
			clients: [
				{
					id: `${userId}-${device}`,
					alterId: 0,
					email: uuid,
					limitIp: 0,
					totalGB: 0,
					expiryTime: newTimestamp,
					enable: true,
					tgId: userId,
					subId: "",
				},
			],
		}),
	}

	await login()
	const response = await useAxios<{ success: boolean }>("/panel/api/inbounds/addClient", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json; charset=utf-8",
		},
		data: subData,
	})
		.then((response) => response.data)
		.catch((error) => {
			return {
				success: false,
			}
		})

	if (response.success) {
		await PrismaLuna.subscription.create({
			data: {
				id: uuid,
				userID: userId,
				is_active: true,
				active_up_to: new Date(newTimestamp),
				vless_config: vlessConfig(userId, device),
				device: device,
			},
		})
		return {
			success: true,
			msg: uuid,
		}
	} else {
		return {
			success: false,
			msg: "Во время создания подписки произошла ошибка - обратитесь в поддержку и мы с радость Вам поможем!",
		}
	}
}
