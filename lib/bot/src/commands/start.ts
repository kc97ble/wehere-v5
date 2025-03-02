import { InlineKeyboard } from "grammy";
import { MessageFormat } from "messageformat";
import { Command } from "../types.ts";
import collections from "../utils/collections.ts";
import { html } from "../utils/format.ts";
import { withDefaultErrorHandler } from "../utils/with.ts";

const vi = {
  html_hello_you_alone: new MessageFormat(
    "vi",
    `Xin chào <b>{$user}</b>! Bạn hiện đang là người duy nhất ở đây.`
  ),
  text_make_me_admin: "Cho tôi làm admin",
  html_set_to_admin_success: new MessageFormat(
    "vi",
    `<i>Đã cho bạn làm admin.</i>`
  ),
  html_admin_already_exists: new MessageFormat(
    "vi",
    `<i>Không thể tự nhận làm admin khi đã có ít nhất một người.</i>`
  ),
};

const main = withDefaultErrorHandler(async (ctx) => {
  const userId = ctx.update.message!.from.id;

  await ctx.reply(
    vi["html_hello_you_alone"].format({ user: html.literal(userId) }),
    {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard().text(
        vi["text_make_me_admin"],
        `v2://start/make_admin`
      ),
    }
  );
});

const make_admin = withDefaultErrorHandler(async (ctx) => {
  const roles = await collections.role.findMany(ctx);
  if (roles.length !== 0) {
    await ctx.reply(
      vi["html_admin_already_exists"].format(), //
      { parse_mode: "HTML" }
    );
    return;
  }

  const callback_query = ctx.update.callback_query!;
  const ack = await collections.role.upsertOne(
    ctx,
    { userId: callback_query.from.id },
    { $set: { role: "ANG", isAdmin: true, updatedAt: Date.now() } }
  );
  console.info(JSON.stringify(ack, null, 2));
  await ctx.reply(
    vi["html_set_to_admin_success"].format(), //
    { parse_mode: "HTML" }
  );
});

const Start = {
  name: "start",
  main,
  routes: {
    make_admin,
  },
} satisfies Command;

export default Start;
