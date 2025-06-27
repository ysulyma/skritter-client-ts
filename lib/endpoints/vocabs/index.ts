import type { ZodSafeParseResult } from "zod/v4";

import type {
  GetVocabByIdQuery,
  GetVocabByIdResponse,
} from "./get-vocab-by-id.ts";
import { type ListVocabsQuery, ListVocabsResponse } from "./list-vocabs.ts";
import type { PutVocabBody, PutVocabResponse } from "./put-vocab.ts";

export const vocabEndpoint = (
  apiFetch: <T, Q extends string>(
    url: string,
    query?: Partial<Record<Q, number | boolean | string>>,
  ) => Promise<T>,
) => ({
  async getSentences(
    id: string,
    query?: GetSentencesQuery,
  ): Promise<GetSentencesResponse> {
    return (await apiFetch(
      `/vocabs/${id}/sentences`,
      query,
    )) as GetSentencesResponse;
  },

  async getVocabById(id: string, options?: GetVocabByIdQuery) {
    return (await apiFetch(`/vocabs/${id}`, options)) as GetVocabByIdResponse;
  },

  async listVocabs(
    query?: ListVocabsQuery,
  ): Promise<ZodSafeParseResult<ListVocabsResponse>> {
    const rawResponse = await apiFetch("/vocabs", query);
    const $parsedResponse = ListVocabsResponse.safeParse(rawResponse);

    if (!$parsedResponse.success) {
      console.log("ERROR [listVocabs]");
      console.dir(
        {
          query,
          rawResponse,
        },
        { depth: null },
      );
    }

    return $parsedResponse;
  },

  async putVocab(id: string, options: PutVocabBody) {
    return await apiFetch<PutVocabResponse>(`/vocabs/${id}`);
  },
});
