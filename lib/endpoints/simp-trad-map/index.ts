import { type ApiFetch, GET } from "../../utils.ts";

import {
  GetSimpTradMapQuery,
  GetSimpTradMapResponse,
} from "./get-simp-trad-map.ts";

/**
 * Skritter can automatically go between simplified and traditional characters for any given word or list of words.
 * To do this, a mapping of simplified to traditional characters is kept and maintained (though rarely updated).
 * Any character not on this list is assumed to be the same in either system.
 * Use this endpoint to access this mapping for advanced features, like:
 * - Generating Vocab ids.
 * - Automatically generating all possible traditional versions of simplified Vocabs or sentences.
 * - Automatically generating the only allowed simplified writing for traditional versions of Vocabs or sentences.
 */
export const simpTradMapEndpoint = (apiFetch: ApiFetch) => ({
  /**
   * Creates a new {@link VocabList}.
   */
  getSimpTradMap: GET(
    "getSimpTradMap",
    "/simptradmap",
    GetSimpTradMapQuery,
    GetSimpTradMapResponse,
    apiFetch,
  ),
});
