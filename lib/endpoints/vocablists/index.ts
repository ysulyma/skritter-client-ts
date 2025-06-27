import type { ZodSafeParseResult } from "zod/v4";

import type {
  ListVocabListsQuery,
  ListVocabListsResponse,
} from "./list-vocab-lists";

/**
 * This endpoint gives you access to all lists a user would have access to (except for ChinesePod lists), as well as the ability to make the same sorts of edits the user is authorized to make. Use this endpoint if you want to:
 *
 * See what lists Skritter has available.
 * See what lists the user is studying, and where they are in their progress.
 * Control what lists a user is studying, or any other such setting.
 * Create, reorganize, or delete lists, or modify their meta data.
 */
export const vocabListsEndpoint = (
  apiFetch: <T, Q extends string>(
    url: string,
    query?: Partial<Record<Q, number | boolean | string>>,
  ) => Promise<T>,
) => ({
  /**
   * Get meta data on lists of various sorts, and a starting point for seeing what there is.
   */
  async listVocabLists(
    query?: ListVocabListsQuery,
  ): Promise<ListVocabListsResponse> {
    return (await apiFetch(`/vocablists`, query)) as ListVocabListsResponse;
  },
});
