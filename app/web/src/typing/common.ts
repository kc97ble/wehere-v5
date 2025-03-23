import { z } from "zod";

export type RefItem = z.infer<typeof RefItem>;
export const RefItem = z.object({
  author: z.string().optional(),
  year: z.string().optional(),
  title: z.string().optional(),
  url: z.string().optional(),
  publisher: z.string().optional(),
  retrievedOn: z.string().optional(),
});

export type SectionUnion = z.infer<typeof SectionUnion>;
export const SectionUnion = z.discriminatedUnion("type", [
  z.object({ type: z.literal("NONE") }),
  z.object({
    type: z.literal("TXT"),
    text: z.string(),
    as: z.enum(["h2", "p"]).optional(),
  }),
  z.object({ type: z.literal("MD"), markdown: z.string() }),
  z.object({ type: z.literal("HTML"), html: z.string() }),
  z.object({
    type: z.literal("IMG1"),
    url: z.string().optional(),
    intrinsicWidth: z.number().optional(),
    intrinsicHeight: z.number().optional(),
    maxWidth: z.number().optional(),
  }),
  z.object({
    type: z.literal("REFL"), // ref list
    title: z.string().optional(),
    items: RefItem.array(),
  }),
]);

export type Section = z.infer<typeof Section>;
export const Section = z.object({
  key: z.number().optional(),
  union: SectionUnion,
});
