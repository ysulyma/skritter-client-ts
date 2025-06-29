import type z from "zod/v4";

import { VocabListSection } from "../../entities/vocab-list-section.ts";

import {
  GetVocabListSectionQuery,
  GetVocabListSectionResponse,
} from "./get-vocab-list-section.ts";

export const PutVocabListSectionBody = VocabListSection.pick({ rows: true });
export type PutVocabListSectionBody = z.infer<typeof PutVocabListSectionBody>;

export const PutVocabListSectionQuery = GetVocabListSectionQuery;
export type PutVocabListSectionQuery = GetVocabListSectionQuery;

export const PutVocabListSectionResponse = GetVocabListSectionResponse;
export type PutVocabListSectionResponse = GetVocabListSectionResponse;
