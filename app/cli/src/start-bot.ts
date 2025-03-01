import { createBot } from "bot";
import { MongoClient } from "mongodb";
import { z } from "zod";

export function percentDecode(value: string): string;
export function percentDecode(value: string | undefined): string | undefined {
  if (value == null) {
    return undefined;
  }
  if (!/^[A-Za-z0-9\-_.!~*'()%:]*$/.test(value)) {
    console.warn("all environment variables should be percent-encoded:", value);
  }
  return decodeURIComponent(value);
}

const ENV = {
  TELEGRAM_BOT_TOKEN: percentDecode(
    z //
      .string({ message: "TELEGRAM_BOT_TOKEN" })
      .parse(process.env.TELEGRAM_BOT_TOKEN)
  ),
  MONGODB_URI: percentDecode(
    z //
      .string({ message: "MONGODB_URI" })
      .parse(process.env.MONGODB_URI)
  ),
  MONGODB_DBNAME: percentDecode(
    z //
      .string({ message: "MONGODB_DBNAME" })
      .parse(process.env.MONGODB_DBNAME)
  ),
};

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
