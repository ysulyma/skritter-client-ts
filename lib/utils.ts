import type z from "zod/v4";
import type { ZodObject, ZodSafeParseResult } from "zod/v4";

export type HttpMethod = "GET" | "POST" | "PUT";

export type ApiFetch = <T, Q extends string>(
  url: string,
  query?: Partial<Record<Q, number | boolean | string>>,
  init?: RequestInit,
) => Promise<T>;

export function GET<
  ZQuery extends ZodObject<any>,
  ZResponse extends ZodObject<any>,
  Url extends string,
>(
  name: string,
  templateUrl: Url,
  // TODO: validate input
  _Query: ZQuery,
  Response: ZResponse,
  apiFetch: ApiFetch,
): Params<Url> extends never
  ? (query?: z.Infer<ZQuery>) => Promise<ZodSafeParseResult<z.infer<ZResponse>>>
  : (
      params: Record<Params<Url>, string>,
      query?: z.Infer<ZQuery>,
    ) => Promise<ZodSafeParseResult<z.infer<ZResponse>>> {
  const params = [...templateUrl.matchAll(/\(.+?\)/g)].map(($_) => $_[1]);

  if (params.length === 0) {
    return (async (query?: z.Infer<ZQuery>) => {
      const rawResponse = await apiFetch(templateUrl, query as any, {
        method: "GET",
      });
      const $parsedResponse = Response.safeParse(rawResponse);

      if (!$parsedResponse.success) {
        console.log(`Error ${name}`);
        console.dir({ $parsedResponse, query, rawResponse }, { depth: null });
        throw new Error();
      }

      return $parsedResponse as ZodSafeParseResult<ZResponse>;
    }) as any;
  } else {
    return (async (
      params: Record<Params<Url>, string>,
      query?: z.Infer<ZQuery>,
    ) => {
      let url = templateUrl as string;
      for (const [key, value] of Object.entries(params) as [string, string][]) {
        const replaceStr = `(${key})`;
        url = url.replace(replaceStr, value);
      }
      const rawResponse = await apiFetch(url, query as any, {
        method: "GET",
      });
      const $parsedResponse = Response.safeParse(rawResponse);

      if (!$parsedResponse.success) {
        console.log(`Error ${name}`);
        console.dir(
          { params, query, rawResponse, url, $parsedResponse },
          { depth: null },
        );
        throw new Error();
      }

      return $parsedResponse;
    }) as any;
  }
}

export function POST<
  ZBody extends ZodObject<any>,
  ZQuery extends ZodObject<any>,
  ZResponse extends ZodObject<any>,
  Url extends string,
>(
  name: string,
  templateUrl: Url,
  // TODO: validate input
  _Body: ZBody,
  _Query: ZQuery,
  Response: ZResponse,
  apiFetch: ApiFetch,
): Params<Url> extends never
  ? (
      body: z.infer<ZBody>,
      query?: z.Infer<ZQuery>,
    ) => Promise<ZodSafeParseResult<z.infer<ZResponse>>>
  : (
      params: Record<Params<Url>, string>,
      body: z.Infer<ZBody>,
      query?: z.Infer<ZQuery>,
    ) => Promise<ZodSafeParseResult<z.infer<ZResponse>>> {
  const params = [...templateUrl.matchAll(/\(.+?\)/g)].map(($_) => $_[1]);

  if (params.length === 0) {
    return (async (body: z.infer<ZBody>, query?: z.Infer<ZQuery>) => {
      const rawResponse = await apiFetch(templateUrl, query as any, {
        body: JSON.stringify(body),
        method: "POST",
      });
      const $parsedResponse = Response.safeParse(rawResponse);

      if (!$parsedResponse.success) {
        console.log(`Error ${name}`);
        console.dir({ body, query, rawResponse }, { depth: null });
        throw new Error();
      }

      return $parsedResponse as ZodSafeParseResult<ZResponse>;
    }) as any;
  } else {
    return (async (
      params: Record<Params<Url>, string>,
      body: z.infer<ZBody>,
      query?: z.Infer<ZQuery>,
    ) => {
      let url = templateUrl as string;
      for (const [key, value] of Object.entries(params) as [string, string][]) {
        const replaceStr = `(${key})`;
        url = url.replace(replaceStr, value);
      }
      const rawResponse = await apiFetch(templateUrl, query as any, {
        body: JSON.stringify(body),
        method: "POST",
      });
      const $parsedResponse = Response.safeParse(rawResponse);

      if (!$parsedResponse.success) {
        console.log(`Error ${name}`);
        console.dir({ body, params, query, rawResponse }, { depth: null });
        throw new Error();
      }

      return $parsedResponse;
    }) as any;
  }
}

export function PUT<
  ZBody extends ZodObject<any>,
  ZQuery extends ZodObject<any>,
  ZResponse extends ZodObject<any>,
  Url extends string,
>(
  name: string,
  templateUrl: Url,
  // TODO: validate input
  _Body: ZBody,
  _Query: ZQuery,
  Response: ZResponse,
  apiFetch: ApiFetch,
): Params<Url> extends never
  ? (
      body: z.infer<ZBody>,
      query?: z.Infer<ZQuery>,
    ) => Promise<ZodSafeParseResult<z.infer<ZResponse>>>
  : (
      params: Record<Params<Url>, string>,
      body: z.Infer<ZBody>,
      query?: z.Infer<ZQuery>,
    ) => Promise<ZodSafeParseResult<z.infer<ZResponse>>> {
  const params = [...templateUrl.matchAll(/\(.+?\)/g)].map(($_) => $_[1]);

  if (params.length === 0) {
    return (async (body: z.infer<ZBody>, query?: z.Infer<ZQuery>) => {
      const rawResponse = await apiFetch(templateUrl, query as any, {
        body: JSON.stringify(body),
        method: "PUT",
      });
      const $parsedResponse = Response.safeParse(rawResponse);

      if (!$parsedResponse.success) {
        console.log(`Error ${name}`);
        console.dir({ body, query, rawResponse }, { depth: null });
        throw new Error();
      }

      return $parsedResponse as ZodSafeParseResult<ZResponse>;
    }) as any;
  } else {
    return (async (
      params: Record<Params<Url>, string>,
      body: z.infer<ZBody>,
      query?: z.Infer<ZQuery>,
    ) => {
      let url = templateUrl as string;
      for (const [key, value] of Object.entries(params) as [string, string][]) {
        const replaceStr = `(${key})`;
        url = url.replace(replaceStr, value);
      }
      const rawResponse = await apiFetch(url, query as any, {
        body: JSON.stringify(body),
        method: "PUT",
      });
      const $parsedResponse = Response.safeParse(rawResponse);

      if (!$parsedResponse.success) {
        console.log(`Error ${name}`);
        console.dir({ body, params, query, rawResponse, url }, { depth: null });
        throw new Error();
      }

      return $parsedResponse;
    }) as any;
  }
}

type Params<S extends string> =
  S extends `${infer _Head}(${infer P})${infer Tail}`
    ? P | Params<Tail>
    : never;

// var hiraganaStart = "ぁ".charCodeAt(0);
// var hiraganaEnd = "ゖ".charCodeAt(0);
// var katakanaStart = "ァ".charCodeAt(0);
// var katakanaEnd = "ヷ".charCodeAt(0);
//
// letters.filter(isKanji)

export function isKanji(str: string) {
  return str < "ぁ" || str > "ヷ";
}
