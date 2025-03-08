import { z } from "zod";

// Section schema definitions
export const SectionUnion = z.discriminatedUnion("type", [
  z.object({ type: z.literal("TXT"), text: z.string() }),
  z.object({ type: z.literal("MD"), markdown: z.string() }),
  z.object({ type: z.literal("HTML"), html: z.string() }),
]);

export type SectionUnion = z.infer<typeof SectionUnion>;

export const Section = z.object({
  updatedAt: z.number().nullable(),
  content: SectionUnion,
});

export type Section = z.infer<typeof Section>;
