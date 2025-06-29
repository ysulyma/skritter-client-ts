import z from "zod/v4";

/**
 * Rows represent a single word (or set of related words) in a list,
 * and any list-specific settings for that word
 *
 * For Chinese, a list always works both for simplified and traditional styles.
 * If a row is for a word with multiple traditional variants, the list must specify
 * which variant will be used.
 *
 * For Japanese, textbooks tend to stagger the learning of Kanji, so students end up studying
 * only the readings and definitions of many words at first.
 * The studyWriting property is used so that Skritter textbook lists can mirror this strategy,
 * and not overwhelm users with Kanji they're not supposed to be learning for class.
 */
export const VocabListRow = z.object({
  /**
   * whether the writing for this word will be studied as part of this list
   * (Japanese only)
   */
  studyWriting: z.boolean().optional(),

  /**
   * The Vocab id of the traditional variant of vocabId.
   * Equivalent to vocabId if there is no variant.
   * (Chinese only)
   */
  tradVocabId: z.string().optional(),
  /** {@link Vocab} id for this word, simplified if Chinese */
  vocabId: z.string(),
});
