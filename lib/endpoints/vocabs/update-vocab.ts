import z from "zod/v4";

import { Vocab } from "../../entities/vocab.ts";

import { GetVocabByIdQuery, GetVocabByIdResponse } from "./get-vocab-by-id.ts";

// body
export const UpdateVocabBody = Vocab;
export type UpdateVocabBody = z.infer<typeof UpdateVocabBody>;

// query
export const UpdateVocabQuery = GetVocabByIdQuery;
export type UpdateVocabQuery = z.infer<typeof UpdateVocabQuery>;

// response
export const UpdateVocabResponse = GetVocabByIdResponse.extend({
  Items: z.array(z.any()),
});
export type UpdateVocabResponse = z.infer<typeof UpdateVocabResponse>;
