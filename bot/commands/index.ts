import { Bot } from "grammy";
import { registerStartCommand } from "./start";

export function registerCommands(bot: Bot) {
  registerStartCommand(bot);
}
