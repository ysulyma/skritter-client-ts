import type { ZodSafeParseResult } from "zod/v4";

import { itemsEndpoint } from "./endpoints/items/index.ts";
import { vocabListsEndpoint } from "./endpoints/vocab-list/index.ts";
import { vocabListSectionEndpoint } from "./endpoints/vocab-list-section/index.ts";
import { vocabEndpoint } from "./endpoints/vocabs/index.ts";

const SKRITTER = "https://legacy.skritter.com/api/v0";

export class SkritterClient {
  // ------------------------- private properties -------------------------
  #token: string;

  // ------------------------- public properties -------------------------

  /**
   * The Item endpoint gives you complete access to what words a user is studying,
   * how well they know it, and some key info about the history of an item's study.
   * Use this endpoint if you would like to know:
   *
   * What words are being studied.
   * How well any given word/part is known.
   * What was studied last, or will be studied next.
   */
  items: ReturnType<typeof itemsEndpoint>;

  /**
   * {@link Vocab}s store all the general and user-specific information about a given word.
   * Use this endpoint if you would like to:
   *
   * Search for a word, given a writing or reading/pinyin.
   * Gather up all of a user's starred words, mnemonics, banned words, or custom definitions.
   * Find all words that have a given character in them.
   * Get information for {@link Item}s you have already collected.
   * If you're downloading a user's entire collection of {@link Item}s, fetch the {@link Item}s by themselves first,
   * then fetch related {@link Vocab}s in batches through this URL. Otherwise, use the `include_vocabs` parameter while {@link Item} fetching.
   */
  vocab: ReturnType<typeof vocabEndpoint>;

  /**
   * This endpoint gives you access to all lists a user would have access to (except for ChinesePod lists), as well as the ability to make the same sorts of edits the user is authorized to make. Use this endpoint if you want to:
   *
   * See what lists Skritter has available.
   * See what lists the user is studying, and where they are in their progress.
   * Control what lists a user is studying, or any other such setting.
   * Create, reorganize, or delete lists, or modify their meta data.
   */
  vocabLists: ReturnType<typeof vocabListsEndpoint>;

  /**
   * This complements the {@link VocabList} endpoints. Use this if you want to
   *
   * Get only a specific section.
   * Edit the words in a list.
   */
  vocabListSections: ReturnType<typeof vocabListSectionEndpoint>;

  constructor(apiToken: string) {
    this.#token = apiToken;

    this.items = itemsEndpoint(this.#fetch.bind(this));
    this.vocab = vocabEndpoint(this.#fetch.bind(this));
    this.vocabLists = vocabListsEndpoint(this.#fetch.bind(this));
    this.vocabListSections = vocabListSectionEndpoint(this.#fetch.bind(this));
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
    init?: RequestInit,
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

    const headers = {
      "Accept-Encoding": "gzip",
      Authorization: `bearer ${this.#token}`,
      "User-Agent": "gzip",
    };
    const res = await fetch(`${SKRITTER}${url}${query}`, {
      headers,
      ...init,
    });
    return await res.json();
  }
}
