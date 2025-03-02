import type {
  BulkWriteOptions,
  Db,
  DeleteResult,
  Document,
  Filter,
  FindOneAndUpdateOptions,
  FindOptions,
  InsertManyResult,
  ObjectId,
  OptionalUnlessRequiredId,
  UpdateFilter,
  UpdateOptions,
  UpdateResult,
  WithoutId,
} from "mongodb";

import type { ZodType, ZodTypeDef } from "zod";
import { DbRole } from "../typing/database.ts";

function makeCollection<T extends Document>(
  name: string,
  schema: ZodType<T, ZodTypeDef, unknown>
) {
  return {
    findMany: async function (
      ctx: { db: Db },
      filter?: Filter<T>,
      options?: FindOptions<T>
    ): Promise<T[]> {
      const cursor = filter
        ? ctx.db.collection<T>(name).find(filter, options)
        : ctx.db.collection<T>(name).find();
      const docs = await cursor.toArray();
      return docs.flatMap((item) => {
        try {
          return [schema.parse(item)];
        } catch {
          return [];
        }
      });
    },

    findOne: async function (
      ctx: { db: Db },
      filter: Filter<T>
    ): Promise<T | undefined> {
      return await ctx.db
        .collection<T>(name)
        .findOne(filter)
        .then((doc) => schema.parse(doc))
        .catch(() => undefined);
    },

    findOneAndUpdate: async function (
      ctx: { db: Db },
      filter: Filter<T>,
      update: UpdateFilter<T>,
      options: FindOneAndUpdateOptions
    ): Promise<T | undefined> {
      return await ctx.db
        .collection<T>(name)
        .findOneAndUpdate(filter, update, options)
        .then((doc) => schema.parse(doc))
        .catch(() => undefined);
    },

    findOneById: async function (ctx: { db: Db }, id: ObjectId): Promise<T> {
      return await ctx.db
        .collection<T>(name)
        .findOne({ _id: id } as Filter<T>)
        .then((doc) => schema.parse(doc));
    },

    updateOne: async function (
      ctx: { db: Db },
      filter: Filter<T>,
      update: UpdateFilter<T>,
      options?: UpdateOptions
    ): Promise<UpdateResult<T>> {
      return await ctx.db
        .collection<T>(name)
        .updateOne(filter, update, options);
    },

    deleteOne: async function (
      ctx: { db: Db },
      filter: Filter<T>
    ): Promise<DeleteResult> {
      return await ctx.db //
        .collection<T>(name)
        .deleteOne(filter);
    },

    upsertOne: async function (
      ctx: { db: Db },
      filter: Filter<T>,
      update: UpdateFilter<T>
    ): Promise<UpdateResult<T>> {
      return await ctx.db //
        .collection<T>(name)
        .updateOne(filter, update, { upsert: true });
    },

    insertOne: async function (ctx: { db: Db }, doc: WithoutId<T>) {
      return ctx.db
        .collection<T>(name)
        .insertOne(doc as OptionalUnlessRequiredId<T>);
    },

    insertMany: async function (
      ctx: { db: Db },
      docs: WithoutId<T>[],
      options?: BulkWriteOptions
    ): Promise<InsertManyResult<T>> {
      return ctx.db
        .collection<T>(name)
        .insertMany(docs as OptionalUnlessRequiredId<T>[], options);
    },
  };
}

const collections = {
  role: makeCollection("role", DbRole),
};

export default collections;
