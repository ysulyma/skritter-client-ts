import z from "zod/v4";

import { ResponseSortOrder, TargetLanguage } from "../../constants.ts";
import { Vocab } from "../../entities/vocab.ts";

export const ListVocabsQuery = z.object({
  /**
   * string used for pagination of containing Vocabs. If included, only containing Vocabs are returned.
   */
  containing_cursor: z.string().optional(),

  /**
   * string used for pagination
   */
  cursor: z.string().optional(),

  /**
   * comma-separated list of Decomps for the returned Vocabs
   */
  decomp_fields: z.string().optional(),

  /**
   * comma-separated list of languages the definitions should include. If 'all', then all definitions are returned.
   * (default: English and user setting)
   */
  definition_langs: z.string().optional(),

  /**
   * comma-separated list of Vocab properties to return.
   * (default: all)*/
  fields: z.string().optional(),

  /**
   * pipe-separated list of Vocabs to fetch.
   * Overrides any query or search based properties used.
   */
  ids: z.string().optional(),

  /**
   * if there is only one single-character Vocab by query,
   * returns a list of Vocabs that include the character.
   * (default: false)*/
  include_containing: z.string().optional(),

  /**
   * returns a list of Decomps for the returned Vocabs
   */
  include_decomps: z.boolean().optional(),

  /**
   * adds Heisig definitions to the Vocabs.
   */
  include_heisigs: z.boolean().optional(),

  /**
   * include vocabs whose priority is less than 0
   * @default false
   */
  include_hidden: z.string().optional(),

  /**
   * returns a list of sentences chosen by the user to learn with the returned Vocabs
   */
  include_sentences: z.boolean().optional(),

  /**
   * adds the highest rated Mnemonics to the returned Vocabs
   */
  include_top_mnemonics: z.boolean().optional(),

  /**
   * The language of the Vocabs you want to search or query for.
   * @default (user setting)
   */
  lang: TargetLanguage.optional(),

  /**
   * maximum number of Vocabs to fetch
   * @default 100
   * @max 100
   */
  limit: z.number().optional(),

  /**
   * timestamp that filters the result based on sort type.
   * For example, if sort is "starred", only returns Vocabs starred after the given offset.
   */
  offset: z.string().optional(),
  /**
   * searches the database for the given writing and/or reading.
   * Uses the same search system as the list editor on the site, so it's pretty flexible.
   * Suggested format: tab separated fields in the order: writing, reading, definition.
   */
  q: z.string().optional(),

  /**
   * comma-separated list of Vocab properties to return for the sentences.
   */
  sentence_fields: z.string().optional(),

  /**
   * response sort order.
   * "starred": when a word was starred
   * "banned": when a word was banned or it's banned settings were changed
   * "mnemonic": when a mnemonic was changed
   * "customDefinition": when a custom definition was changed
   * "all": when any of the above properties were changed
   */
  sort: ResponseSortOrder.optional(),
});
export type ListVocabsQuery = z.infer<typeof ListVocabsQuery>;

export const ListVocabsResponse = z.object({
  /**
   * list of containing Vocabs. Only included if a containing search was conducted.
   */
  ContainingVocabs: z.unknown().optional(),

  /**
   * string to pass back in future requests for pagination. If not included, there are no more. If included, there probably are more.
   */
  containingCursor: z.string().optional(),

  /**
   * string to pass back in future requests for pagination. If not included, there are no more. If included, there probably are more.
   */
  cursor: z.string().optional(),

  /**
   * list of Decomps for the returned Vocabs list.
   */
  Decomps: z.string().optional(),

  /**
   * object. If doing a search, returns how 'q' was parsed, for debugging purposes
   */
  parsed: z.object().optional(),

  /**
   * list of sentence Vocabs for the returned Vocabs list.
   */
  Sentences: z.array(Vocab).optional(),

  /**
   * list of Vocabs. If by id, non existent Vocabs will have null in their place.
   */
  Vocabs: z.array(Vocab),
});

export type ListVocabsResponse = z.infer<typeof ListVocabsResponse>;

type M = Pick<ListVocabsResponse, "containingCursor">;
