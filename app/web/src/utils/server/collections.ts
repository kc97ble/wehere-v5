import { makeCollection } from "database";
import { DbPost } from "../../typing/database";

const collections = {
  post: makeCollection("post", DbPost),
};

export default collections;
