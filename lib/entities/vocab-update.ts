import z from "zod/v4";

/**
 * Vocab Updates are daily reports on what Vocabs were changed on a given day.
 * Used by clients to know what locally-stored Vocabs need updating.
 */
export const VocabUpdate = z.object({
  date: z.iso.date(),

  /** Bases of the Japanese Vocabs that were changed. */
  jaBases: z.array(z.string()),

  /** Bases of the Chinese Vocabs that were changed. Bases are the second of three values in Vocab ids. */
  zhBases: z.array(z.string()),
});

export type VocabUpdate = z.infer<typeof VocabUpdate>;
