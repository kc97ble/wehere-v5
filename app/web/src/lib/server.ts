import { postProcessEnv } from "common";
import { Db, MongoClient } from "mongodb";
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
});

export async function withDb<R>(cb: (db: Db) => R): Promise<Awaited<R>> {
  console.log("Connecting to DB:", ENV.MONGODB_DBNAME);
  const client = await MongoClient.connect(ENV.MONGODB_URI);
  const db = client.db(ENV.MONGODB_DBNAME);
  console.log("Connected to DB.");

  try {
    return await cb(db);
  } finally {
    console.log("Closing DB connection:", ENV.MONGODB_DBNAME);
    await client.close();
    console.log("Closed.");
  }
}
