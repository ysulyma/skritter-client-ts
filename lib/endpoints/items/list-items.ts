import z from "zod/v4";

import { TargetLanguage } from "../../constants.ts";
import { Item } from "../../entities/item.ts";
import { Vocab } from "../../entities/vocab.ts";

export const ListItemsQuery = z.object({
  /** string used for pagination */
  cursor: z.union([z.number(), z.string()]).optional(),
  // offset
  // timestamp that filters the result based on sort type. For example, if sort is "next", only returns Items due after the given offset.
  // ids
  // pipe-separated list of Items to fetch. Overrides any query based properties used.
  // vocab_ids
  // pipe-separated list of Vocabs to fetch items for. Overrides any query based properties used.
  // vocab_list
  // id of a VocabList to fetch items for. Only works for "next" queries.
  // include_contained
  // whether to return child Item objects of those returned. If include_vocabs is included, also adds contained Vocab objects in the response.
  // (default: false)
  //
  /** comma-separated list of Item properties to return. */
  fields: z.string().optional(),
  // decomp_fields
  // comma-separated list of Decomps for the returned Vocabs

  /** returns only the ids of the Items, and is relatively fast. Cannot do sort 'next' or any of the 'include' parameters. Limit can go as high as 1000. */
  ids_only: z.boolean().optional(),
  // (default: all)
  // definition_langs
  // comma-separated list of languages the Vocab definitions should include.
  // (default: English and user setting)
  // include_heisigs
  // adds Heisig definitions to the Vocabs.
  // include_sentences
  // returns a list of sentences chosen by the user to learn with the returned Vocabs
  // sentence_fields
  // comma-separated list of Vocab properties to return for the sentences.
  // include_top_mnemonics
  // adds the highest rated Mnemonics to the returned Vocabs
  /** returns a list of {@link Decomp}s for the returned {@link Vocab}s */
  include_decomps: z.boolean().optional(),

  // (default: all)
  /** whether to return {@link Vocab} objects related to the {@link Item}s returned. */
  include_vocabs: z.boolean().optional(),
  /**
   * The language of the Items you want to fetch.
   * @default user setting
   */
  lang: TargetLanguage.optional(),
  // (default: user setting)
  // styles
  // comma-separated list of styles to include in the response. Only works for 'next' sort.
  // (default: user setting) (Chinese only)
  // created
  // returns only Items created before the given timestamp.

  /**
   * maximum number of {@link Item}s to fetch.
   * Note that for 'last' and 'changed' sorts first fetch this number of {@link Item}s,
   * then filters out based on styles and parts, so you may not receive this number of
   * {@link Item}s in the response, even though there are more.
   */
  limit: z.int().min(0).optional(),

  /** comma-separated list of parts to include in the response. Only works for 'next' sort. */
  parts: z.string().optional(),

  /**
   * response sort order.
   * "next": what will be studied next (based on current settings)
   * "last": what was studied (regardless of current settings)
   * "changed": when properties were changed for any reason
   * @default last
   */
  sort: z.enum(["next", "last", "changed"]).optional(),
  // (default: false)
  //
  // comma-separated list of Vocab properties to return.
  vocab_fields: z.string().optional(),
});
export type ListItemsQuery = z.infer<typeof ListItemsQuery>;

export const ListItemsResponse = z.object({
  /** string to pass back in future requests for pagination. If not included, there are no more. If included, there probably are more. */
  cursor: z.union([z.number(), z.string()]).optional(),

  /** list of {@link Item}s. If by id, non existent {@link Item}s will have null in their place. Includes {@link Item}s for the child {@link Vocab}s. */
  Items: z.array(Item),

  /** list of related Vocabs. */
  Vocabs: z.array(Vocab).optional(),

  /** object of Vocab ids to Item ids, to simplify relating the two. Only returned if vocab_ids is used. */
  vocabItemMap: z.record(z.string(), z.string()).optional(),
});

export type ListItemsResponse = z.infer<typeof ListItemsResponse>;
