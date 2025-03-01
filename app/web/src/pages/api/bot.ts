import { createBot, webhookCallback } from "bot";
import type { NextApiRequest, NextApiResponse } from "next";
import { serializeError } from "serialize-error";
import { ENV, withDb } from "../../lib/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await withDb(async (db) => {
      const bot = await createBot(ENV.TELEGRAM_BOT_TOKEN, { db });
      await webhookCallback(bot, "next-js", {
        // https://core.telegram.org/bots/api#setwebhook
        // https://grammy.dev/ref/core/webhookoptions#secrettoken
        secretToken: ENV.TELEGRAM_BOT_API_SECRET_TOKEN || undefined,
      })(req, res);
    });
  } catch (error) {
    console.error(serializeError(error));
    res.status(207).json(serializeError(error));
  }
}
