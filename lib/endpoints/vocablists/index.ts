import { type ApiFetch, GET, POST } from "../../utils.ts";

import {
  CreateVocabListBody,
  CreateVocabListQuery,
  CreateVocabListResponse,
} from "./create-vocab-list.ts";
import { GetVocabListQuery, GetVocabListResponse } from "./get-vocab-list.ts";
import {
  ListVocabListsQuery,
  ListVocabListsResponse,
} from "./list-vocab-lists.ts";

/**
 * This endpoint gives you access to all lists a user would have access to (except for ChinesePod lists), as well as the ability to make the same sorts of edits the user is authorized to make. Use this endpoint if you want to:
 *
 * See what lists Skritter has available.
 * See what lists the user is studying, and where they are in their progress.
 * Control what lists a user is studying, or any other such setting.
 * Create, reorganize, or delete lists, or modify their meta data.
 */
export const vocabListsEndpoint = (apiFetch: ApiFetch) => ({
  /**
   * Creates a new {@link VocabList}.
   */
  createVocabList: POST(
    "createVocabList",
    "/vocablists",
    CreateVocabListBody,
    CreateVocabListQuery,
    CreateVocabListResponse,
    apiFetch,
  ),
  /** Fetches a single list and all its sections. Include the id in the url.  */
  getVocabList: GET(
    "getVocabList",
    "/vocablists/(id)",
    GetVocabListQuery,
    GetVocabListResponse,
    apiFetch,
  ),

  /**
   * Get meta data on lists of various sorts, and a starting point for seeing what there is.
   */
  listVocabLists: GET(
    "listVocabLists",
    "/vocablists",
    ListVocabListsQuery,
    ListVocabListsResponse,
    apiFetch,
  ),
});
