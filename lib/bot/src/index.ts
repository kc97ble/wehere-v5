import { autoRetry } from "@grammyjs/auto-retry";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import { Bot } from "grammy";
import Start from "./commands/start.ts";
import { BotFullContext, BotInjectedContext } from "./types.ts";

export async function createBot(
  telegramBotToken: string,
  injectedContext: BotInjectedContext
): Promise<Bot<BotFullContext>> {
  const bot = new Bot<BotFullContext>(telegramBotToken);

  bot.use(async (ctx, next) => {
    Object.assign(ctx, injectedContext);
    await next();
  });

  bot.api.config.use(apiThrottler());
  bot.api.config.use(autoRetry());

  bot.command("start", Start["/"]);

  bot.on("message", (ctx) => ctx.reply("Got another message!"));

  return bot;
}

export { Api, webhookCallback } from "grammy";
