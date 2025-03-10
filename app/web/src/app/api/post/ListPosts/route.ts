import { compose } from "web/utils/common/compose";
import {
  withCors,
  withDb,
  withErrorHandling,
  withQueryParser,
} from "web/utils/server/with";
import { doListPosts } from "../logic";
import { PrListPosts } from "../typing";

export const GET = compose(
  withErrorHandling,
  withCors,
  withDb(),
  withQueryParser(PrListPosts)
)(async (params, [_request, [db, _]]) => {
  return await doListPosts({ db }, params);
});
