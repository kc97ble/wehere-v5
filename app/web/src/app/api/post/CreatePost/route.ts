import { Db } from "mongodb";
import { compose } from "../../../../utils/common/compose";
import collections from "../../../../utils/server/collections";
import {
  withBodyParser,
  withCors,
  withDb,
  withErrorHandling,
} from "../../../../utils/server/with";
import { PrCreatePost, RsCreatePost } from "../typing";

async function doCreatePost(
  ctx: { db: Db },
  params: PrCreatePost
): Promise<RsCreatePost> {
  const ack = await collections.post.insertOne(ctx, {
    title: params.title,
    content: params.content,
  });
  return { postId: ack.insertedId.toHexString() };
}

export const POST = compose(
  withErrorHandling,
  withCors,
  withDb(),
  withBodyParser(PrCreatePost)
)(async (params, [_request, [db, _]]) => {
  return await doCreatePost({ db }, params);
});
