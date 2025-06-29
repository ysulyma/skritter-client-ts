import {
  CreateVocabListBody,
  CreateVocabListQuery,
  CreateVocabListResponse,
} from "./create-vocab-list.ts";

/**
 * One {@link VocabList} object with the parameters you would like to set.
 * Only mutable properties will be used; all others will be ignored, and any missing properties will be set to defaults.
 *
 * **The rows property will be ignored in this endpoint.**
 * Editing words must be done when editing individual sections.
 * You can, however, create and name sections with this call.
 *
 * The name and sections properties must be included in the VocabList, and names must be included in all {@link VocabListSection}s.
 * All other properties are optional.
 */
export const UpdateVocabListBody = CreateVocabListBody;
export type UpdateVocabListBody = CreateVocabListBody;

export const UpdateVocabListQuery = CreateVocabListQuery;
export type UpdateVocabListQuery = CreateVocabListQuery;

export const UpdateVocabListResponse = CreateVocabListResponse;
export type UpdateVocabListResponse = CreateVocabListResponse;
