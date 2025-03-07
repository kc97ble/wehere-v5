import { postProcessEnv } from "common";
import { z } from "zod";

console.log(process.env.TELEGRAM_BOT_TOKEN);

export const ENV = postProcessEnv({
  TELEGRAM_BOT_TOKEN: z //
    .string({ message: "TELEGRAM_BOT_TOKEN" })
    .parse(process.env.TELEGRAM_BOT_TOKEN),
  TELEGRAM_BOT_API_SECRET_TOKEN: z //
    .string({ message: "TELEGRAM_BOT_API_SECRET_TOKEN" })
    .parse(process.env.TELEGRAM_BOT_API_SECRET_TOKEN),
  MONGODB_URI: z //
    .string({ message: "MONGODB_URI" })
    .parse(process.env.MONGODB_URI),
  MONGODB_DBNAME: z //
    .string({ message: "MONGODB_DBNAME" })
    .parse(process.env.MONGODB_DBNAME),
});
