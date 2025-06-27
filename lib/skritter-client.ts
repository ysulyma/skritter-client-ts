import type { ZodSafeParseResult } from "zod/v4";

import { itemsEndpoint } from "./endpoints/items/index.ts";
import { vocabEndpoint } from "./endpoints/vocabs/index.ts";

const SKRITTER = "https://legacy.skritter.com/api/v0";

export class SkritterClient {
  #token: string;

  items: ReturnType<typeof itemsEndpoint>;
  vocab: ReturnType<typeof vocabEndpoint>;

  constructor(apiToken: string) {
    this.#token = apiToken;

    this.items = itemsEndpoint(this.#fetch.bind(this));
    this.vocab = vocabEndpoint(this.#fetch.bind(this));
  }

  paginated<F extends (req: any) => any>(
    fn: F,
  ): (
    req: Parameters<typeof fn>[0],
  ) => ReturnType<F> extends Promise<ZodSafeParseResult<infer T>>
    ? AsyncGenerator<ZodSafeParseResult<T>, void, unknown>
    : never {
    return async function* (req: Parameters<typeof fn>[0]): any {
      let cursor: string | number | undefined;
      let containingCursor: string | number | undefined;

      do {
        const res = await fn({
          ...req,
          ...(cursor ? { cursor } : undefined),
          ...(containingCursor
            ? { containing_cursor: containingCursor }
            : undefined),
        });
        yield res;

        if (!res.success) {
          console.dir(res, { depth: null });
          break;
        }

        cursor = res.data.cursor;
        containingCursor = res.data.containingCursor;
      } while (cursor);
    };
  }

  async #fetch<T, Q extends string>(
    url: string,
    params?: Partial<Record<Q, string | boolean | number>>,
  ): Promise<T> {
    const convertedParams =
      typeof params === "undefined"
        ? undefined
        : Object.fromEntries(
            Object.entries(params).map(([key, value]): [string, string] => [
              key,
              String(value),
            ]),
          );

    const query =
      convertedParams && Object.keys(convertedParams).length > 0
        ? "?" + new URLSearchParams(convertedParams).toString()
        : "";

    const res = await fetch(`${SKRITTER}${url}${query}`, {
      headers: {
        "Accept-Encoding": "gzip",
        Authorization: `bearer ${this.#token}`,
        "User-Agent": "gzip",
      },
    });
    return await res.json();
  }
}
