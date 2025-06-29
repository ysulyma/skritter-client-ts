import z from "zod/v4";

import { VocabListSection } from "../../entities/vocab-list-section.ts";

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

export const GetVocabListSectionQuery = z.object({
  /** optional list of strings, comma delimited. Only returns the {@link VocabListSection} properties listed. */
  fields: z.string().optional(),
});
export type GetVocabListSectionQuery = z.infer<typeof GetVocabListSectionQuery>;

export const GetVocabListSectionResponse = z.object({
  /** The requested section, or null if it does not exist. */
  VocabListSection: VocabListSection,
});

export type GetVocabListSectionResponse = z.infer<
  typeof GetVocabListSectionResponse
>;
