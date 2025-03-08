import { compose } from "../../../../utils/common/compose";
import {
  withBodyParser,
  withCors,
  withDb,
  withErrorHandling,
} from "../../../../utils/server/with";
import { doGetPost } from "../logic";
import { PrGetPost } from "../typing";

export const POST = compose(
  withErrorHandling,
  withCors,
  withDb(),
  withBodyParser(PrGetPost)
)(async (params, [_request, [db, _]]) => {
  return await doGetPost({ db }, params);
});
