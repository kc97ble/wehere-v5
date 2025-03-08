import { Db, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { compose } from "web/utils/common/compose";
import collections from "web/utils/server/collections";
import {
  withBodyParser,
  withCors,
  withDb,
  withErrorHandling,
} from "web/utils/server/with";
import { PrDeletePost, RsDeletePost } from "../typing";

async function doDeletePost(
  ctx: { db: Db },
  params: PrDeletePost
): Promise<RsDeletePost> {
  const ack = await collections.post.deleteOne(ctx, {
    _id: new ObjectId(params.postId),
  });

  if (!ack.deletedCount) {
    throw NextResponse.json({ error: "post not found" }, { status: 404 });
  }

  return { success: true };
}

export const POST = compose(
  withErrorHandling,
  withCors,
  withDb(),
  withBodyParser(PrDeletePost)
)(async (params, [_request, [db, _]]) => {
  return await doDeletePost({ db }, params);
});
