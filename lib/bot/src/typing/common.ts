import { z } from "zod";

export type Role = z.infer<typeof Role>;
export const Role = z.enum(["MOR", "ANG"]);

export type Timestamp = z.infer<typeof Timestamp>;
export const Timestamp = z.coerce.number().int().safe();

export type UserAgent = z.infer<typeof UserAgent>;
export const UserAgent = z.enum(["TG", "WEB"]);
