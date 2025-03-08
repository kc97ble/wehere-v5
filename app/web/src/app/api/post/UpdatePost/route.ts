import { compose } from "web/utils/common/compose";
import {
  withBodyParser,
  withCors,
  withDb,
  withErrorHandling,
} from "web/utils/server/with";
import { doUpdatePost } from "../logic";
import { PrUpdatePost } from "../typing";

export const POST = compose(
  withErrorHandling,
  withCors,
  withDb(),
  withBodyParser(PrUpdatePost)
)(async (params, [_request, [db, _]]) => {
  return await doUpdatePost({ db }, params);
});
