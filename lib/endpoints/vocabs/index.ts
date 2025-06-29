import { type ApiFetch, GET } from "../../utils.ts";

import { GetVocabByIdQuery, GetVocabByIdResponse } from "./get-vocab-by-id.ts";
import { ListSentencesQuery, ListSentencesResponse } from "./list-sentences.ts";
import { ListVocabsQuery, ListVocabsResponse } from "./list-vocabs.ts";

export const vocabEndpoint = (apiFetch: ApiFetch) => ({
  getSentences: GET(
    "getSentences",
    "/vocabs/(id)/sentences",
    ListSentencesQuery,
    ListSentencesResponse,
    apiFetch,
  ),

  getVocabById: GET(
    "getVocabById",
    "/vocabs/(id)",
    GetVocabByIdQuery,
    GetVocabByIdResponse,
    apiFetch,
  ),

  listVocabs: GET(
    "listVocabs",
    "/vocabs",
    ListVocabsQuery,
    ListVocabsResponse,
    apiFetch,
  ),
});
