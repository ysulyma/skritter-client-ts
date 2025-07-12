import { z } from "zod/v4";

import { VocabUpdate } from "../../entities/vocab-update.ts";

export const ListVocabUpdatesQuery = z.object({
  /** comma-separated list of {@link VocabUpdate} properties to return. */
  fields: z.string(),

  /** maximum number of {@link VocabUpdate}s to fetch */
  limit: z.int().max(100).default(100),
  /** return updates from after the specified offset (YYYY-MM-DD) */
  offset: z.iso.date(),
});

export type ListVocabUpdatesQuery = z.infer<typeof ListVocabUpdatesQuery>;

export const ListVocabUpdatesResponse = z.object({
  /** list of {@link VocabUpdate}s. */
  VocabUpdates: z.array(VocabUpdate),
});

export type ListVocabUpdatesResponse = z.infer<typeof ListVocabUpdatesResponse>;
