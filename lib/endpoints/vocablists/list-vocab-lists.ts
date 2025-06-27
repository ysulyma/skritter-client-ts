import { z } from "zod/v4";

import { ResponseSortOrder, TargetLanguage } from "../../constants";
import { VocabList } from "../../entities/vocablist";

export const ListVocabListsQuery = z.object({
  /** string used for pagination */
  cursor: z.string(),

  /** comma-separated list of VocabList properties to return. */
  fields: z.string(),

  /** pipe-separated list of VocabLists to fetch. Overrides any query properties used. */
  ids: z.string(),

  /** Includes property `percentDone` in VocabLists returned. It is costly in terms of resources so use only when needed. */
  include_percent_done: z.boolean(),

  /** Includes property `creatorName` in VocabLists returned. */
  include_user_names: z.boolean(),
  lang: TargetLanguage,

  /**
   * maximum number of VocabLists to fetch
   * @default 100
   * @max 100
   */
  limit: z.int().max(100),

  /** timestamp that filters the result based on sort type. Only works for "published" and "custom". */
  offset: z.string().optional(),

  /** Required for "search" sort. Returns list containing the given word. */
  q: z.string().optional(),

  /**
   * response sort order.
   * "published": lists made by all users, sorted by when they were published
   * "custom": made by the user, sorted by when it was last changed
   * "official": lists Skritter provides, sorted alphabetically
   * "disabled": this user's custom lists that have been disabled
   * "studying": lists the user is currently studying, sorted by when their settings were last changed.
   * "search": search published lists that contain a given word, passed in through "q"
   * "adding": lists being added from by the user
   * "deleted": custom lists which have been deleted by the user
   * @default "published"
   */
  sort: ResponseSortOrder,
});

export type ListVocabListsQuery = z.infer<typeof ListVocabListsQuery>;

export const ListVocabListsResponse = z.object({
  /** list of VocabLists. Does not include the sections property. If by id, non existent VocabLists will have null in their place. */
  VocabLists: z.array(VocabList),

  /** string to pass back in future requests for pagination. If not included, there are no more. If included, there probably are more. */
  cursor: z.string().optional(),
});

export type ListVocabListsResponse = z.infer<typeof ListVocabListsResponse>;
