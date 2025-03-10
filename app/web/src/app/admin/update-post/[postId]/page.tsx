import { doGetPost } from "web/app/api/post/logic";
import { withDbClassic } from "web/utils/server/with";
import { z } from "zod";
import PageUpdatePostV2 from "../containers/PageUpdatePostV2";

const Params = z.object({
  postId: z.string(),
});

export default async function UpdatePostPage({
  params,
}: {
  params: Promise<unknown>;
}) {
  const { postId } = Params.parse(await params);
  const { post } = await withDbClassic((db) => doGetPost({ db }, { postId }));
  return <PageUpdatePostV2 postId={postId} initialData={post} />;
}
