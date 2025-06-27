import z from "zod/v4";

export const ResponseSortOrder = z.enum([
  "starred",
  "banned",
  "mnemonic",
  "customDefinition",
  "all",
]);
export type ResponseSortOrder = z.infer<typeof ResponseSortOrder>;

export const Toughness = z.enum(["hard", "super rare"]);

/** Used for Items, to distinguish the different kinds of study available. */
export const ItemPart = z.enum(["rune", "defn", "rdng", "tone"]);
export type ItemPart = z.infer<typeof ItemPart>;

/** Languages Skritter teaches. Used throughout the API. */
export const TargetLanguage = z.enum(["zh", "ja"]);
export type TargetLanguage = z.infer<typeof TargetLanguage>;

/** Languages Skritter supports for its definitions. Used by Vocabs. */
export const SourceLanguage = z.enum([
  "ar",
  "da",
  "de",
  "en",
  "es",
  "fi",
  "fr",
  "hi",
  "hu",
  "it",
  "ja",
  "ko",
  "nl",
  "no",
  "pl",
  "pt",
  "ro",
  "ru",
  "sv",
  "vi",
  "yue",
  "zh-cn",
  "zh-tw",
]);
export type SourceLanguage = z.infer<typeof SourceLanguage>;

/** Used by Vocabs and Items. */
export const ChineseStyle = z.enum(["simp", "trad", "both", "none"]);
export type ChineseStyle = z.infer<typeof ChineseStyle>;

export const Ilk = z.enum(["char", "word", "sent"]);
export type Ilk = z.infer<typeof Ilk>;
