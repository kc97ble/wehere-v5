import { z } from "zod";

export type PrCreatePost = z.infer<typeof PrCreatePost>;
export const PrCreatePost = z.object({
  title: z.string(),
  content: z.string().optional(),
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
    content: z.string().nullish(),
    createdAt: z.number(),
  }),
});

export type PrListPosts = z.infer<typeof PrListPosts>;
export const PrListPosts = z.object({
  offset: z.number().default(0),
  limit: z.number().min(1).max(100).default(10),
});

export type RsListPosts = z.infer<typeof RsListPosts>;
export const RsListPosts = z.object({
  posts: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      content: z.string().nullish(),
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
  success: z.boolean(),
});
