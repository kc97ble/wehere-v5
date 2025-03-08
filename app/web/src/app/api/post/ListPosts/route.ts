import { Db } from "mongodb";
import { compose } from "../../../../utils/common/compose";
import collections from "../../../../utils/server/collections";
import {
  withBodyParser,
  withCors,
  withDb,
  withErrorHandling,
} from "../../../../utils/server/with";
import { PrListPosts, RsListPosts } from "../typing";

async function doListPosts(
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

export const POST = compose(
  withErrorHandling,
  withCors,
  withDb(),
  withBodyParser(PrListPosts)
)(async (params, [_request, [db, _]]) => {
  return await doListPosts({ db }, params);
});
