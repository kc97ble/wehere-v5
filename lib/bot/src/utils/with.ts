import { serializeError } from "serialize-error";
import { BotFullContext } from "../types.ts";
import { html } from "./format.ts";

export function withDefaultErrorHandler(cb: (ctx: BotFullContext) => void) {
  return async (ctx: BotFullContext) => {
    try {
      await Promise.resolve(cb(ctx));
    } catch (error) {
      if (error === false) {
        return; // shortcut to gracefully stop
      }
      let chatId;
      if ((chatId = ctx.chat?.id)) {
        await ctx.api.sendMessage(
          chatId,
          html.pre(
            html.literal(JSON.stringify(serializeError(error), null, 2))
          ),
          { parse_mode: "HTML" }
        );
      }
      throw error;
    }
  };
}
