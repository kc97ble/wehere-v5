import { Db, MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { serializeError } from "serialize-error";
import { ZodType, ZodTypeDef } from "zod";
import { ENV } from "./env";

export type NextHandler<C> = (
  request: NextRequest,
  context: C
) => Promise<NextResponse>;

export async function withDbClassic<R>(cb: (db: Db) => R): Promise<Awaited<R>> {
  console.log("Connecting to DB:", ENV.MONGODB_DBNAME);
  const client = await MongoClient.connect(ENV.MONGODB_URI);
  const db = client.db(ENV.MONGODB_DBNAME);
  console.log("Connected to DB.");

  try {
    return await cb(db);
  } finally {
    console.log("Closing DB connection:", ENV.MONGODB_DBNAME);
    await client.close();
    console.log("Closed.");
  }
}

export function withDb<C>() {
  return function (cb: NextHandler<[Db, C]>): NextHandler<C> {
    return async function (request, context) {
      console.log("Connecting to DB:", ENV.MONGODB_DBNAME);
      const client = await MongoClient.connect(ENV.MONGODB_URI);
      const db = client.db(ENV.MONGODB_DBNAME);
      console.log("Connected to DB.");

      try {
        return await cb(request, [db, context]);
      } finally {
        console.log("Closing DB connection:", ENV.MONGODB_DBNAME);
        await client.close();
        console.log("Closed.");
      }
    };
  };
}

export function withErrorHandling<C>(cb: NextHandler<C>): NextHandler<C> {
  return async function (request, context) {
    try {
      return await cb(request, context);
    } catch (error) {
      if (error instanceof NextResponse) {
        return error;
      } else {
        console.error(error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
      }
    }
  };
}

export function withCors<C>(handler: NextHandler<C>): NextHandler<C> {
  return async function (request, context) {
    // const origin = request.headers.get("Origin") || "";
    const response = await handler(request, context);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    // if (isOriginAllowed(origin)) {
    //   response.headers.set("Access-Control-Allow-Origin", origin);
    // }
    return response;
  };
}

export function withBodyParser<T, TI, R, C>(
  schema: ZodType<T, ZodTypeDef, TI>
) {
  return (
    handler: (params: T, context: [NextRequest, C]) => Promise<R>
  ): NextHandler<C> => {
    return async function (request, context) {
      const body = await request.json();
      const parsed = schema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(serializeError(parsed.error), { status: 400 });
      } else {
        const result = await handler(parsed.data, [request, context]);
        return NextResponse.json(result, { status: 200 });
      }
    };
  };
}

export function withQueryParser<T, TI, R, C>(
  schema: ZodType<T, ZodTypeDef, TI>
) {
  return (
    handler: (params: T, context: [NextRequest, C]) => Promise<R>
  ): NextHandler<C> => {
    return async function (request, context) {
      const query = Object.fromEntries(request.nextUrl.searchParams.entries());
      const parsed = schema.safeParse(query);
      if (!parsed.success) {
        return NextResponse.json(serializeError(parsed.error), { status: 400 });
      } else {
        const result = await handler(parsed.data, [request, context]);
        return NextResponse.json(result, { status: 200 });
      }
    };
  };
}
