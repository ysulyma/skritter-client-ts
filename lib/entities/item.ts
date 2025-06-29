import z from "zod/v4";

/**
 * Items are the atomic units of learning in Skritter, tracking reviews and learning.
 * An item could be the writing for a character, or the tone of a word.
 *
 * Also, they can cover more than one word or character, in the case of Chinese.
 * If, for example, a simplified and traditional character have the same definition,
 * a user can only have one item for that shared definition. However, there will be
 * two separate items for the writing of each character. An item does not store the
 * word information though; that's the job of the {@link Vocab}.
 */
export const Item = z.object({
  /** timestamp of when this item was last altered in any way */
  changed: z.number().optional(),

  /** timestamp of when this item was created */
  created: z.number().optional(),

  id: z.string().optional(),

  /** number of seconds it was originally scheduled for (so not necessarily next - last, if last has been changed since) */
  interval: z.number().optional(),
  lang: z.string().optional(),

  /** timestamp of when it was last studied. */
  last: z.number().optional(),

  /** timestamp of when it's due */
  next: z.number().optional(),

  part: z.string().optional(),

  /** integer, the interval value prior to the last review */
  previousInterval: z.number().optional(),

  /** boolean, whether the last review had a score greater than 1 */
  previousSuccess: z.boolean().optional(),

  /** number of times this item has been reviewed */
  reviews: z.number().optional(),

  /** list of VocabListSection ids from which the word was added. This list parallels vocabListIds. */
  sectionIds: z.array(z.string()).optional(),

  style: z.string().optional(),

  /** number of times this item was scored 2 or higher */
  successes: z.number().optional(),

  /** total time spent studying this item in seconds */
  timeStudied: z.number().optional(),

  /** list of Vocab ids that this item 'covers' for this user. */
  vocabIds: z.array(z.string()).optional(),

  /** list of VocabList ids from which this item was added */
  vocabListIds: z.array(z.string()).optional(),
});

export type Item = z.infer<typeof Item>;
