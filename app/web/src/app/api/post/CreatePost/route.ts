import { Db, WithoutId } from "mongodb";
import { DbPost } from "../../../../typing/database";
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
  // Create a post with sections if content is provided
  const postData: WithoutId<DbPost> = {
    title: params.title,
  };

  const ack = await collections.post.insertOne(ctx, postData);
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
