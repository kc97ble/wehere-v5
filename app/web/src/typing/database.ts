import { DbObjectId } from "bot/src/typing/database";
import { z } from "zod";

export type DbPost = z.infer<typeof DbPost>;
export const DbPost = z.object({
  _id: DbObjectId,
  title: z.string(),
  content: z.string().nullish(),
  content_plainText: z.string().nullish(),
  updatedAt: z.number().nullish(),
});
