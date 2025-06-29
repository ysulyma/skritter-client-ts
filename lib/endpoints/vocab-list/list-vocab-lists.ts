import { z } from "zod/v4";

import { TargetLanguage } from "../../constants.ts";
import { VocabList } from "../../entities/vocab-list.ts";

export const ListVocabListsQuery = z.object({
  /** string used for pagination */
  cursor: z.string().optional(),

  /** comma-separated list of VocabList properties to return. */
  fields: z.string().optional(),

  /** pipe-separated list of VocabLists to fetch. Overrides any query properties used. */
  ids: z.string().optional(),

  /** Includes property `percentDone` in VocabLists returned. It is costly in terms of resources so use only when needed. */
  include_percent_done: z.boolean().optional(),

  /** Includes property `creatorName` in VocabLists returned. */
  include_user_names: z.boolean().optional(),

  /**
   * The language of the Vocabs you want to query for.
   */
  lang: TargetLanguage.optional(),

  /**
   * maximum number of VocabLists to fetch
   * @default 100
   * @max 100
   */
  limit: z.int().max(100).optional(),

  /** timestamp that filters the result based on sort type. Only works for "published" and "custom". */
  offset: z.string().optional(),

  /** Required for "search" sort. Returns list containing the given word. */
  q: z.string().optional(),

  /**
   * response sort order.
   * "adding": lists being added from by the user
   * "custom": made by the user, sorted by when it was last changed
   * "deleted": custom lists which have been deleted by the user
   * "disabled": this user's custom lists that have been disabled
   * "official": lists Skritter provides, sorted alphabetically
   * "published": lists made by all users, sorted by when they were published
   * "search": search published lists that contain a given word, passed in through "q"
   * "studying": lists the user is currently studying, sorted by when their settings were last changed.
   * @default "published"
   */
  sort: z.enum([
    "adding",
    "custom",
    "deleted",
    "disabled",
    "official",
    "published",
    "search",
    "studying",
  ]),
});

export type ListVocabListsQuery = z.infer<typeof ListVocabListsQuery>;

export const ListVocabListsResponse = z.object({
  /** string to pass back in future requests for pagination. If not included, there are no more. If included, there probably are more. */
  cursor: z.string().optional(),

  /** list of VocabLists. Does not include the sections property. If by id, non existent VocabLists will have null in their place. */
  VocabLists: z.array(VocabList.omit({ sections: true })),
});

export type ListVocabListsResponse = z.infer<typeof ListVocabListsResponse>;
