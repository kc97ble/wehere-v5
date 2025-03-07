import { Db, ObjectId } from "mongodb";
import { compose } from "../../../../utils/common/compose";
import collections from "../../../../utils/server/collections";
import {
  withBodyParser,
  withCors,
  withDb,
  withErrorHandling,
} from "../../../../utils/server/with";
import { PrDeletePost, RsDeletePost } from "../typing";

async function doDeletePost(
  ctx: { db: Db },
  params: PrDeletePost
): Promise<RsDeletePost> {
  try {
    const result = await collections.post.deleteOne(
      ctx,
      { _id: new ObjectId(params.postId) }
    );
    
    return {
      success: result.deletedCount > 0,
    };
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      success: false,
    };
  }
}

export const POST = compose(
  withErrorHandling,
  withCors,
  withDb(),
  withBodyParser(PrDeletePost)
)(async (params, [_request, [db, _]]) => {
  return await doDeletePost({ db }, params);
});