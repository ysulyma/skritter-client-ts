import { z } from "zod/v4";

import { VocabUpdate } from "../../entities/vocab-update.ts";

export const GetVocabUpdateQuery = z.object({
  /** comma-separated list of {@link VocabUpdate} properties to return. */
  fields: z.string(),
});

export type GetVocabUpdateQuery = z.infer<typeof GetVocabUpdateQuery>;

export const GetVocabUpdateResponse = z.object({
  /** The requested {@link VocabUpdate}. */
  VocabUpdate: VocabUpdate,
});

export type GetVocabUpdateResponse = z.infer<typeof GetVocabUpdateResponse>;
