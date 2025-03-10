import { DbObjectId } from "bot/src/typing/database";
import { z } from "zod";
import { Section } from "./common";

export type DbPost = z.infer<typeof DbPost>;
export const DbPost = z.object({
  _id: DbObjectId,
  title: z.string(),
  sections: Section.array().default([]),
  tags: z.string().array().default([]),
  postedAt: z.number().nullish(),
  updatedAt: z.number().nullish(),
});
