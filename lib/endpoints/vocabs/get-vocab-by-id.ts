export interface GetVocabByIdQuery {
  /**
   * comma-separated list of Vocab properties to return.
   */

  fields: string;

  /**
   * adds Heisig definitions to the Vocab.
   */

  include_heisig: string;

  /**
   * returns a sentence chosen by the user to learn with the returned Vocab
   */
  include_sentence: string;

  /**
   * comma-separated list of Vocab properties to return for the sentence.
   */

  sentence_fields: string;

  /**
   * adds the highest rated Mnemonic to the returned Vocab
   */
  include_top_mnemonic: string;

  /**
   * returns the Decomps for the returned Vocab
   */
  include_decomp: string;

  /**
   * comma-separated list of Decomps for the returned Vocab
   */
  decomp_fields: string;

  /**
   * if this is a single-character Vocab,
   * returns a list of Vocabs that include the character.
   * (default: false)*/
  include_containing: string;

  /**
   * string used for pagination of containing Vocabs
   */
  containing_cursor: string;
}

export interface GetVocabByIdResponse {
  /**
   * The requested Vocab.
   */

  Vocab: string;

  /**
   * The sentence Vocab referenced by the property sentenceId.
   */

  Sentence: string;

  /**
   * The Decomp for the returned Vocab.
   */

  Decomp: string;

  /**
   * list of containing Vocabs. Only included if include_containing is true.
   */

  ContainingVocabs: string;
}
