import { Db, WithoutId } from "mongodb";
import { DbPost } from "web/typing/database";
import { compose } from "web/utils/common/compose";
import collections from "web/utils/server/collections";
import {
  withBodyParser,
  withCors,
  withDb,
  withErrorHandling,
} from "web/utils/server/with";
import { PrCreatePost, RsCreatePost } from "../typing";

async function doCreatePost(
  ctx: { db: Db },
  params: PrCreatePost
): Promise<RsCreatePost> {
  // Create a post with sections if content is provided
  const dbPost: WithoutId<DbPost> = {
    title: params.title,
    sections: [],
    tags: [],
  };

  const ack = await collections.post.insertOne(ctx, dbPost);
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
