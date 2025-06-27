import z from "zod/v4";

/**  Mnemonics are associated with {@link Vocab}s. */
export const Mnemonic = z.object({
  changed: z.int(),

  /** User id of the person who created the Mnemonic */
  creator: z.string(),

  public: z.boolean(),
  text: z.string(),

  /** how many people are using this Mnemonic */
  usage: z.int(),
});
export type Mnemonic = z.infer<typeof Mnemonic>;
