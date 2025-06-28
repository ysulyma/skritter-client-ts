import z from "zod/v4";

import { Vocab } from "../../entities/vocab.ts";

export const ListSentencesQuery = z.object({
  /**
   * string used for pagination
   */
  cursor: z.string().optional(),

  /**
   * comma-separated list of {@link Vocab} properties to return.
   * (default: all)
   */
  fields: z.string().optional(),

  /**
   * The language of the {@link Vocab}s you want to search or query for.
   * (default: user setting)
   */
  lang: z.string(),

  /**
   * maximum number of {@link Vocab}s to fetch
   * @default 10
   * @max 10
   */
  limit: z.string(),
});
export type ListSentencesQuery = z.infer<typeof ListSentencesQuery>;

export const ListSentencesResponse = z.object({
  /**
   * string to pass back in future requests for pagination. If not included, there are no more. If included, there probably are more.
   */
  cursor: z.string().optional(),

  /**
   * list of sentence {@link Vocab}s. May return a few more than the given limit.
   */
  Sentences: z.array(Vocab).optional(),
});

export type ListSentencesResponse = z.infer<typeof ListSentencesResponse>;
