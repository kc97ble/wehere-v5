import { createBot } from "bot";
import { postProcessEnv } from "common";
import { MongoClient } from "mongodb";
import { z } from "zod";

const ENV = postProcessEnv({
  TELEGRAM_BOT_TOKEN: z //
    .string({ message: "TELEGRAM_BOT_TOKEN" })
    .parse(process.env.TELEGRAM_BOT_TOKEN),
  MONGODB_URI: z //
    .string({ message: "MONGODB_URI" })
    .parse(process.env.MONGODB_URI),
  MONGODB_DBNAME: z //
    .string({ message: "MONGODB_DBNAME" })
    .parse(process.env.MONGODB_DBNAME),
});

async function main() {
  console.log("Connecting to DB:", ENV.MONGODB_DBNAME);
  const client = await MongoClient.connect(ENV.MONGODB_URI);
  const db = client.db(ENV.MONGODB_DBNAME);
  console.log("Connected to DB.");

  try {
    const bot = await createBot(ENV.TELEGRAM_BOT_TOKEN, { db });
    await bot.start();
  } finally {
    console.log("Closing DB connection:", ENV.MONGODB_DBNAME);
    await client.close();
    console.log("Closed.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
