import { autoRetry } from "@grammyjs/auto-retry";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import assert from "assert";
import { Bot } from "grammy";
import Start from "./commands/start.ts";
import { BotFullContext, BotInjectedContext, Command } from "./types.ts";
import { withDefaultErrorHandler } from "./utils/with.ts";

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

  const commands = [Start];

  for (const command of commands) {
    if (command.name && !!command.main) {
      bot.command(command.name, command.main);
    }
  }

  bot.on(
    "callback_query:data",
    withDefaultErrorHandler(async (ctx) => {
      const url = new URL(ctx.callbackQuery!.data!);
      assert(url.protocol === "v2:", "invalid protocol");
      const command: Command | undefined = commands.find(
        (c) => c.name === url.host
      );
      assert.ok(command, "command not found");
      const routes = command.routes!;
      const key = Object.keys(routes).find(
        (k) => k == url.pathname || "/" + k === url.pathname
      );
      assert.ok(key, "route not found");
      await routes[key]!(ctx);
    })
  );

  bot.on("message", (ctx) => ctx.reply("Got another message!"));

  return bot;
}

export { Api, webhookCallback } from "grammy";
