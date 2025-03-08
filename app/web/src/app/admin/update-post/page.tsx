import { doGetPost } from "web/app/api/post/logic";
import PageUpdatePost from "web/containers/PageUpdatePost";
import { withDbClassic } from "web/utils/server/with";
import { z } from "zod";

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
