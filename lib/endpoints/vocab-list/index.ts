import { type ApiFetch, GET, POST, PUT } from "../../utils.ts";

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
import {
  UpdateVocabListBody,
  UpdateVocabListQuery,
  UpdateVocabListResponse,
} from "./update-vocab-list.ts";

/**
 * This endpoint gives you access to all lists a user would have access to (except for ChinesePod lists),
 * as well as the ability to make the same sorts of edits the user is authorized to make.
 * Use this endpoint if you want to:
 *
 * - See what lists Skritter has available.
 * - See what lists the user is studying, and where they are in their progress.
 * - Control what lists a user is studying, or any other such setting.
 * - Create, reorganize, or delete lists, or modify their meta data.
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

  /**
   * Alters an existing {@link VocabList} or its settings for this user.
   * Same as when creating a list in every way, except that it modifies an existing list.
   * Also similarly, you cannot use this call to modify words within the list.
   *
   * For the sections list, all existing undeleted sections must be included to be valid.
   * If you are deleting a {@link VocabListSection}, mark it so with the deleted field.
   * If you are creating a new {@link VocabListSection}, don't include an id for its object.
   * As above, for new {@link VocabListSections}, names must be included, but all other properties are optional.
   */
  updateVocabList: PUT(
    "updateVocabList",
    "/vocablists/(id)",
    UpdateVocabListBody,
    UpdateVocabListQuery,
    UpdateVocabListResponse,
    apiFetch,
  ),
});
