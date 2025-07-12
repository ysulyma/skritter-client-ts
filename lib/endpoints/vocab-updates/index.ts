import { type ApiFetch, GET } from "../../utils.ts";

import {
  GetVocabUpdateQuery,
  GetVocabUpdateResponse,
} from "./get-vocab-update.ts";
import {
  ListVocabUpdatesQuery,
  ListVocabUpdatesResponse,
} from "./list-vocab-updates.ts";

export const vocabUpdatesEndpoint = (apiFetch: ApiFetch) => ({
  /**  Fetches a single {@link VocabUpdate} for the given date. */
  getVocabUpdate: GET(
    "getVocabUpdate",
    "/vocabupdates/(date)",
    GetVocabUpdateQuery,
    GetVocabUpdateResponse,
    apiFetch,
  ),

  listVocabUpdates: GET(
    "listVocabUpdates",
    "/vocabupdates",
    ListVocabUpdatesQuery,
    ListVocabUpdatesResponse,
    apiFetch,
  ),
});
