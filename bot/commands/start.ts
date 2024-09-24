import { Bot, InlineKeyboard, Keyboard } from "grammy";

const keyboard = new InlineKeyboard().text("test 2");

export function registerStartCommand(lunaBot: Bot) {
  lunaBot.command("start", async (ctx) => {
    await ctx.reply("123", {
      reply_markup: keyboard,
    });
  });
}
