import { autoRetry } from "@grammyjs/auto-retry";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import { Bot, Context } from "grammy";
import type { Db } from "mongodb";

export type BotInjectedContext = {
  db: Db;
};

export type BotContext = Context & BotInjectedContext;

export async function createBot(
  telegramBotToken: string,
  injectedContext: BotInjectedContext
): Promise<Bot<BotContext>> {
  const bot = new Bot<BotContext>(telegramBotToken);

  bot.use(async (ctx, next) => {
    Object.assign(ctx, injectedContext);
    await next();
  });

  bot.api.config.use(apiThrottler());
  bot.api.config.use(autoRetry());

  bot.on("message", (ctx) => ctx.reply("Got another message!"));

  return bot;
}

export { Api, webhookCallback } from "grammy";
