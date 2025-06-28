import z from "zod/v4";

import { VocabList } from "../../entities/vocablist.ts";

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

export const CreateVocabListBody = VocabList.partial();
export type CreateVocabListBody = z.infer<typeof CreateVocabListBody>;

export const CreateVocabListQuery = z.object({
  /** comma-separated list of VocabList properties to return. */
  fields: z.string().optional(),

  // comma-separated list of {@link VocabListSection} properties to return.
  sectionFields: z.string().optional(),
});
export type CreateVocabListQuery = z.infer<typeof CreateVocabListQuery>;

export const CreateVocabListResponse = z.object({
  /**  The created list, complete with sections.  */
  VocabList,
});
export type CreateVocabListResponse = z.infer<typeof CreateVocabListResponse>;
