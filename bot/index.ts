import { env } from "bun";
import { Bot } from "grammy";
import { registerCommands } from "./commands/index";

export const lunaBot = new Bot(env.BOT_TOKEN);
registerCommands(lunaBot);

lunaBot.start();

process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down...");
  lunaBot.stop();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down...");
  lunaBot.stop();
  process.exit(0);
});

process.on("SIGHUP", () => {
  console.log("Received SIGTERM, shutting down...");
  lunaBot.stop();
  process.exit(0);
});
