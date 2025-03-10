import { Db, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import collections from "web/utils/server/collections";
import {
  PrGetPost,
  PrListPosts,
  PrUpdatePost,
  RsGetPost,
  RsListPosts,
  RsUpdatePost,
} from "./typing";

export async function doGetPost(
  ctx: { db: Db },
  params: PrGetPost
): Promise<RsGetPost> {
  const post = await collections.post.findOne(ctx, {
    _id: ObjectId.createFromHexString(params.postId),
  });

  if (!post) {
    throw NextResponse.json(
      { error: `Post not found: ${params.postId}` },
      { status: 404 }
    );
  }

  return {
    post: {
      id: post._id.toHexString(),
      title: post.title,
      sections: post.sections,
      tags: post.tags,
      postedAt: post.postedAt ?? undefined,
      createdAt: post._id.getTimestamp().valueOf(),
    },
  };
}

export async function doUpdatePost(
  ctx: { db: Db },
  { postId, title, sections, tags, postedAt }: PrUpdatePost
): Promise<RsUpdatePost> {
  const result = await collections.post.updateOne(
    ctx,
    { _id: ObjectId.createFromHexString(postId) },
    { $set: { title, sections, tags, postedAt } }
  );

  if (result.matchedCount === 0) {
    throw NextResponse.json({ error: "post not found" }, { status: 404 });
  }

  return { success: true };
}

export async function doListPosts(
  ctx: { db: Db },
  params: PrListPosts
): Promise<RsListPosts> {
  const { offset, limit, order } = params;

  // Get the posts with pagination
  const posts = await collections.post.findMany(
    ctx,
    {}, // No filter
    {
      skip: offset,
      limit,
      sort: { _id: order === "ASC" ? 1 : -1 },
    }
  );

  // Count total posts
  const total = await ctx.db.collection("post").countDocuments();

  return {
    posts: posts.map((post) => ({
      id: post._id.toHexString(),
      title: post.title,
      createdAt: post._id.getTimestamp().valueOf(),
    })),
    total,
  };
}
