import { type ApiFetch, GET, PUT } from "../../utils.ts";

import {
  GetVocabListSectionQuery,
  GetVocabListSectionResponse,
} from "./get-vocab-list-section.ts";
import {
  PutVocabListSectionBody,
  PutVocabListSectionQuery,
  PutVocabListSectionResponse,
} from "./put-vocab-list-section.ts";

export const vocabListSectionEndpoint = (apiFetch: ApiFetch) => ({
  /** Fetches a single section within a list.  */
  getVocabListSection: GET(
    "getVocabListSection",
    "/vocablists/(vocabListId)/sections/(sectionId)",
    GetVocabListSectionQuery,
    GetVocabListSectionResponse,
    apiFetch,
  ),

  /** Modifies a single section within a list. Can only be used to modify the section rows, so the only property used is rows.  */
  putVocabListSection: PUT(
    "putVocabListSection",
    "/vocablists/(vocabListId)/sections/(sectionId)",
    PutVocabListSectionBody,
    PutVocabListSectionQuery,
    PutVocabListSectionResponse,
    apiFetch,
  ),
});
