import { type ApiFetch, GET, PUT } from "../../utils.ts";

import { GetVocabByIdQuery, GetVocabByIdResponse } from "./get-vocab-by-id.ts";
import { ListSentencesQuery, ListSentencesResponse } from "./list-sentences.ts";
import { ListVocabsQuery, ListVocabsResponse } from "./list-vocabs.ts";
import {
  UpdateVocabBody,
  UpdateVocabQuery,
  UpdateVocabResponse,
} from "./update-vocab.ts";

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

  /**  Alters custom user properties for an existing {@link Vocab}. */
  updateVocab: PUT(
    "updateVocab",
    "/vocabs/(id)",
    UpdateVocabBody,
    UpdateVocabQuery,
    UpdateVocabResponse,
    apiFetch,
  ),
});
