import type { GetVocabByIdQuery } from "./get-vocab-by-id";

export type PutVocabBody = GetVocabByIdQuery;

export interface PutVocabResponse extends PutVocabBody {
  /**
   * list of Items that were altered due to changes
   * in the bannedParts property.
   */
  Items: string;
}
