import { ZodType, ZodTypeDef } from "zod";

export type QueryObject = Record<string, string | number | boolean | undefined>;

export function getUrl(
  pathName: `/${string}`,
  query: QueryObject = {}
): string {
  const url = new URL(pathName, location.origin);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
}

export async function httpGet<T>(
  schema: ZodType<T, ZodTypeDef, unknown>,
  url: string,
  options: {
    signal?: AbortSignal;
    cache: "force-cache" | "no-store";
    next?: NextFetchRequestConfig; // https://nextjs.org/docs/app/api-reference/functions/fetch
  }
): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers: { Accepts: "application/json" },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => undefined);
    throw new Error(
      [`GET failed (${response.status})`, url].join("\n"), //
      { cause: { status: response.status, text } }
    );
  }

  const data = await response.json();
  return schema.parse(data);
}

export async function httpPost<T>(
  schema: ZodType<T, ZodTypeDef, unknown>,
  url: string,
  body: unknown,
  options: { signal?: AbortSignal } = {}
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body, null, 2),
    signal: options.signal,
    cache: "no-cache",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => undefined);
    throw new Error(
      [`POST failed (${response.status})`, url].join("\n"), //
      { cause: { status: response.status, text } }
    );
  }

  const data = await response.json();
  return schema.parse(data);
}
