import { ObjectId } from "mongodb";
import { z } from "zod";
import { Role, Timestamp, UserAgent } from "./common.ts";

export type DbObjectId = z.infer<typeof DbObjectId>;
export const DbObjectId = z
  .union([z.string(), z.number(), z.instanceof(ObjectId)])
  .transform((input) => {
    switch (typeof input) {
      case "number":
        return ObjectId.createFromTime(input);
      case "string":
        return ObjectId.createFromHexString(input);
      case "object":
        return input;
      default:
        throw new TypeError("invalid object id");
    }
  });

export type DbRole = z.infer<typeof DbRole>;
export const DbRole = z.object({
  userId: z.number(),
  role: Role,
  isAdmin: z.boolean().nullish(),
  updatedAt: z.number().nullish(),
  // TODO: add displayed name
});

export type DbThread = z.infer<typeof DbThread>;
export const DbThread = z.object({
  _id: DbObjectId,
  name: z.string().nullish(), // unique
  emoji: z.string().nullish(),
  createdAt: Timestamp.nullish(),
  userAgent: UserAgent.nullish(),
  password: z.string().uuid().nullish(),
});
