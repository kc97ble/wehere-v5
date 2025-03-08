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
import { PrGetPost, RsGetPost } from "../typing";

async function doGetPost(
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
      sections: post.sections?.map((section) => ({
        updatedAt: section.updatedAt || null,
        content: section.union,
      })),
      createdAt: post._id.getTimestamp().valueOf(),
    },
  };
}

export const POST = compose(
  withErrorHandling,
  withCors,
  withDb(),
  withBodyParser(PrGetPost)
)(async (params, [_request, [db, _]]) => {
  return await doGetPost({ db }, params);
});
