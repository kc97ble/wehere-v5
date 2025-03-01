import * as assert from "assert";
import { InlineKeyboard } from "grammy";
import { MessageFormat } from "messageformat";
import { html } from "../utils/format.ts";
import { withDefaultErrorHandler } from "../utils/with.ts";

const vi = {
  "html-hello-you-alone": new MessageFormat(
    "vi",
    `Xin chào <b>{$user}</b>! Bạn hiện đang là người duy nhất ở đây.`
  ),
  "text-make-me-an-admin": "Cho tôi làm admin",
};

const main = withDefaultErrorHandler(async (ctx) => {
  const userId = ctx.update.message?.from.id;
  assert.ok(userId);

  await ctx.reply(
    vi["html-hello-you-alone"].format({ user: html.literal(userId) }),
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard().text(
        vi["text-make-me-an-admin"],
        `v2://set_role?user=${userId}&role=admin`
      ),
    }
  );
});

const Start = {
  "/": main,
};

export default Start;
