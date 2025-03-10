import { notFound } from "next/navigation";
import { doGetPost } from "web/app/api/post/logic";
import PagePost from "web/containers/(client)/PagePost";
import { withDbClassic } from "web/utils/server/with";
import { z } from "zod";

type Props = {
  params: Promise<unknown>;
};

const Params = z.object({
  postId: z.string(),
});

export default async function PostPage({ params }: Props) {
  try {
    const { postId } = Params.parse(await params);
    const { post } = await withDbClassic((db) => doGetPost({ db }, { postId }));

    return (
      <PagePost
        postId={postId}
        title={post.title}
        sections={post.sections || []}
        tags={post.tags || []}
        postedAt={post.postedAt}
      />
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    notFound();
  }
}
