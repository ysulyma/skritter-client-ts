import z from "zod/v4";

import {
  ChineseStyle,
  Ilk,
  SourceLanguage,
  TargetLanguage,
} from "../constants.ts";

import { Mnemonic } from "./mnemonic";

/**
 * Vocabs are complementary to the Item entity,
 * and provide all the user-specific settings for a word,
 * as well as all the information about the word.
 */
export const Vocab = z.object({
  /** url string of the sound file */
  audio: z.string(),

  audios: z
    .array(
      z.object({
        id: z.string(),
        mp3: z.string(),
        reading: z.string(),
        source: z.string(),
        writing: z.string(),
      }),
    )
    .optional(),
  // (Chinese only)
  // changed
  // timestamp for the last time the user specific properties have changed, such as customDefinition or mnemonic
  //
  /** list of the parts that have been banned for this user */
  bannedParts: z.array(z.string()),
  // (mutable)
  containedVocabIds: z.array(z.string()).optional(),

  // (mutable)
  customDefinition: z.string().optional(),

  /**
   * object (dictionary) of language strings to official Skritter definition strings
   * (mutable by ballers)
   */
  definitions: z.partialRecord(SourceLanguage, z.string()),

  // list of Vocab ids of the characters that form this word
  // (multi-character words only)
  /** Heisig definition for this character. Returned only if include_heisigs is true. */
  heisigDefinition: z.string().optional(),
  id: z.string(),

  /** (mutable by ballers) */
  ilk: Ilk,

  lang: TargetLanguage,

  /** most popular Mnemonic entity for this Vocab. Returned only if `include_top_mnemonics` is true. */
  mnemonic: Mnemonic.optional(),

  /**
   * determines priority in search queries, the higher the priority the higher the word appears in searches.
   * Default value is 0. A value of -1 will effectively delete the Vocab for users.
   * @default 0
   */
  priority: z.number().optional(),

  /**
   * Whether or not the Kanji is less frequently used.
   * (Japanese only, mutable by ballers)
   */
  rareKanji: z.boolean().optional(),

  /** (mutable by ballers) */
  reading: z.string(),
  sentenceId: z.string().optional(),
  // Vocab id of the sentence for this word for this user. If the user has not chosen a sentence, the most popular one is returned. Returned only if include_sentences is true.
  sentenceIds: z.array(z.string()),
  // chosen Mnemonic entity for this Vocab, if there is one
  // (mutable)
  starred: z.string().optional(),
  // boolean or timestamp. Set with boolean, get when vocab was starred
  // (mutable)
  style: ChineseStyle,
  // Complete list of Vocab ids of sentences chosen by this user. Unlike sentenceId, this list is always returned, but these are not included in the separate list of Sentences in the Vocab Endpoints for performance reasons. If you need the full list, fetch them separately, preferably as needed.
  // (mutable)
  topMnemonic: z.string().optional(),

  // float of how difficult and rare the Vocab is (higher is more difficult)
  toughness: z.number(),

  /** human-readable version of toughness */
  toughnessString: z.string(),

  /** (mutable by ballers, for chunking sentences) */
  writing: z.string(),
  // 'char', 'word', or 'sent', whether the Vocab is a character, word or sentence respectively.
  // (mutable by ballers)
});

export type Vocab = z.infer<typeof Vocab>;
