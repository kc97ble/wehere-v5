import { Section } from "web/typing/common";
import { z } from "zod";

export type PrCreatePost = z.infer<typeof PrCreatePost>;
export const PrCreatePost = z.object({
  title: z.string(),
});

export type RsCreatePost = z.infer<typeof RsCreatePost>;
export const RsCreatePost = z.object({
  postId: z.string(),
});

export type PrGetPost = z.infer<typeof PrGetPost>;
export const PrGetPost = z.object({
  postId: z.string(),
});

export type RsGetPost = z.infer<typeof RsGetPost>;
export const RsGetPost = z.object({
  post: z.object({
    id: z.string(),
    title: z.string(),
    sections: z.array(Section),
    tags: z.string().array(),
    postedAt: z.number().optional(),
    createdAt: z.number(),
  }),
});

export type PrListPosts = z.infer<typeof PrListPosts>;
export const PrListPosts = z.object({
  offset: z.coerce.number().int().default(0),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  order: z.enum(["ASC", "DES"]).optional(),
});

export type RsListPosts = z.infer<typeof RsListPosts>;
export const RsListPosts = z.object({
  posts: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      createdAt: z.number(),
    })
  ),
  total: z.number(),
});

export type PrDeletePost = z.infer<typeof PrDeletePost>;
export const PrDeletePost = z.object({
  postId: z.string(),
});

export type RsDeletePost = z.infer<typeof RsDeletePost>;
export const RsDeletePost = z.object({
  success: z.literal(true),
});

export type PrUpdatePost = z.infer<typeof PrUpdatePost>;
export const PrUpdatePost = z.object({
  postId: z.string(),
  title: z.string().optional(),
  sections: z.array(Section).optional(),
  tags: z.string().array().optional(),
  postedAt: z.number().nullish(),
});

export type RsUpdatePost = z.infer<typeof RsUpdatePost>;
export const RsUpdatePost = z.object({
  success: z.literal(true),
});
