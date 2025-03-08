import { Db, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import collections from "web/utils/server/collections";
import { PrGetPost, PrUpdatePost, RsGetPost, RsUpdatePost } from "./typing";

export async function doGetPost(
  ctx: { db: Db },
  params: PrGetPost
): Promise<RsGetPost> {
  const post = await collections.post.findOne(ctx, {
    _id: ObjectId.createFromHexString(params.postId),
  });

  if (!post) {
    throw NextResponse.json({ error: "post not found" }, { status: 404 });
  }

  return {
    post: {
      id: post._id.toHexString(),
      title: post.title,
      sections: post.sections,
      createdAt: post._id.getTimestamp().valueOf(),
    },
  };
}

export async function doUpdatePost(
  ctx: { db: Db },
  { postId, title, sections }: PrUpdatePost
): Promise<RsUpdatePost> {
  const result = await collections.post.updateOne(
    ctx,
    { _id: ObjectId.createFromHexString(postId) },
    { $set: { title, sections } }
  );

  if (result.matchedCount === 0) {
    throw NextResponse.json({ error: "post not found" }, { status: 404 });
  }

  return { success: true };
}
