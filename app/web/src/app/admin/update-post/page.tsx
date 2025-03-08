import { z } from "zod";
import PageUpdatePost from "../../../containers/PageUpdatePost";
import { withDbClassic } from "../../../utils/server/with";
import { doGetPost } from "../../api/post/GetPost/route";

const Params = z.object({
  postId: z.string(),
});

export default async function UpdatePostPage({
  searchParams,
}: {
  searchParams: Promise<unknown>;
}) {
  const { postId } = Params.parse(await searchParams);
  const { post } = await withDbClassic((db) => doGetPost({ db }, { postId }));

  // Pass the post data to the client component
  return (
    <PageUpdatePost
      postId={postId}
      initialData={{
        title: post.title,
        sections: post.sections || [],
      }}
    />
  );
}
