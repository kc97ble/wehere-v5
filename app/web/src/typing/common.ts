import { z } from "zod";

// Section schema definitions
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
]);

export type SectionUnion = z.infer<typeof SectionUnion>;

export const Section = z.object({
  key: z.number().optional(),
  union: SectionUnion,
});

export type Section = z.infer<typeof Section>;
