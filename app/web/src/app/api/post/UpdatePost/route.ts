import { Db, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { compose } from "../../../../utils/common/compose";
import collections from "../../../../utils/server/collections";
import {
  withBodyParser,
  withCors,
  withDb,
  withErrorHandling,
} from "../../../../utils/server/with";
import { PrUpdatePost, RsUpdatePost } from "../typing";

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

export const POST = compose(
  withErrorHandling,
  withCors,
  withDb(),
  withBodyParser(PrUpdatePost)
)(async (params, [_request, [db, _]]) => {
  return await doUpdatePost({ db }, params);
});
