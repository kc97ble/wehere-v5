import { makeCollection } from "database";
import { DbRole } from "../typing/database.ts";

const collections = {
  role: makeCollection("role", DbRole),
};

export default collections;
