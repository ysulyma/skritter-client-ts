import z from "zod/v4";

import { VocabListRow } from "./vocab-list-row.ts";

/** Sections organize the words within a VocabList.  */
export const VocabListSection = z
  .object({
    changed: z.number(),

    /** The date the user completed this section. Not included if the section has never been completed before. */
    completed: z.number(),

    created: z.number(),

    /** boolean for requests that delete a section, timestamp of date deleted for responses */
    deleted: z.union([z.boolean(), z.number()]),

    id: z.string(),

    name: z.string(),

    /** list of {@link VocabListRow}s */
    rows: z.array(VocabListRow),
  })
  .partial();
