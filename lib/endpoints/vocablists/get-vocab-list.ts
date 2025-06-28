import z from "zod/v4";

import { VocabList } from "../../entities/vocablist.ts";

export const GetVocabListQuery = z.object({
  /** comma-separated list of {@link VocabList} properties to return. */
  fields: z.string(),

  /** if true, include "completed" date in VocabListSection entities */
  includeSectionCompletion: z.boolean().optional(),

  /** comma-separated list of {@link VocabListSection} properties to return. */
  sectionFields: z.string(),
});

export type GetVocabListQuery = z.infer<typeof GetVocabListQuery>;

export const GetVocabListResponse = z.object({
  /** The requested list, complete with sections, or null if the VocabList does not exist.  */
  VocabList: VocabList,
});

export type GetVocabListResponse = z.infer<typeof GetVocabListResponse>;
