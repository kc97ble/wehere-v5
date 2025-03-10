import { postProcessEnv } from "common";
import { z } from "zod";

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
  AWS_ACCESS_KEY_ID: z //
    .string({ message: "AWS_ACCESS_KEY_ID" })
    .parse(process.env.AWS_ACCESS_KEY_ID),
  AWS_SECRET_ACCESS_KEY: z //
    .string({ message: "AWS_SECRET_ACCESS_KEY" })
    .parse(process.env.AWS_SECRET_ACCESS_KEY),
  AWS_REGION: z //
    .string({ message: "AWS_REGION" })
    .parse(process.env.AWS_REGION),
  AWS_BUCKET_NAME: z //
    .string({ message: "AWS_BUCKET_NAME" })
    .parse(process.env.AWS_BUCKET_NAME),
});
