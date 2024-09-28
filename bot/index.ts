import { env } from "bun"
import { Bot } from "grammy"
import { registerCommands } from "./commands/index"
import { registerEvents } from "./events"
import { PrismaClient } from "@prisma/client"
import { type Prisma } from "@prisma/client"

export const lunaBot = new Bot(env.BOT_TOKEN)
export const PrismaLuna = new PrismaClient()
PrismaLuna.$connect()
registerCommands(lunaBot)
registerEvents(lunaBot)

lunaBot.start()

process.on("SIGINT", () => {
	console.log("Received SIGINT, shutting down...")
	lunaBot.stop()
	process.exit(0)
})

process.on("SIGTERM", () => {
	console.log("Received SIGTERM, shutting down...")
	lunaBot.stop()
	process.exit(0)
})

process.on("SIGHUP", () => {
	console.log("Received SIGTERM, shutting down...")
	lunaBot.stop()
	process.exit(0)
})
