import { z } from "zod";

export type Role = z.infer<typeof Role>;
export const Role = z.enum(["MOR", "ANG"]);
