import { z } from "zod/v4";

import { Vocab } from "../../entities/vocab.ts";

export const GetVocabByIdQuery = z.object({
  /**
   * string used for pagination of containing {@link Vocab}s
   */
  containing_cursor: z.string().optional(),

  /**
   * comma-separated list of Decomps for the returned {@link Vocab}
   */
  decomp_fields: z.string().optional(),
  /**
   * comma-separated list of Vocab properties to return.
   */
  fields: z.string().optional(),

  /**
   * if this is a single-character {@link Vocab},
   * returns a list of {@link Vocab}s that include the character.
   * @default false
   */
  include_containing: z.string().optional(),

  /**
   * returns the {@link Decomp}s for the returned {@link Vocab}
   */
  include_decomp: z.boolean().optional(),

  /**
   * adds Heisig definitions to the Vocab.
   */
  include_heisig: z.boolean().optional(),

  /**
   * returns a sentence chosen by the user to learn with the returned {@link Vocab}
   */
  include_sentence: z.boolean().optional(),

  /**
   * adds the highest rated {@link Mnemonic} to the returned {@link Vocab}
   */
  include_top_mnemonic: z.boolean().optional(),

  /**
   * comma-separated list of {@link Vocab} properties to return for the sentence.
   */

  sentence_fields: z.string().optional(),
});

export type GetVocabByIdQuery = z.infer<typeof GetVocabByIdQuery>;

export const GetVocabByIdResponse = z.object({
  /**
   * list of containing {@link Vocab}s. Only included if `include_containing` is true.
   */
  ContainingVocabs: z.array(Vocab).optional(),

  /**
   * The {@link Decomp} for the returned Vocab.
   */
  Decomp: z.unknown().optional(),

  /**
   * The sentence {@link Vocab} referenced by the property `sentenceId`.
   */
  Sentence: z.unknown().optional(),
  /**
   * The requested {@link Vocab}.
   */
  Vocab: Vocab,
});

export type GetVocabByIdResponse = z.infer<typeof GetVocabByIdResponse>;
