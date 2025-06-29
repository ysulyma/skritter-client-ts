import z from "zod/v4";

import { ItemPart } from "../constants.ts";

import { VocabListSection } from "./vocab-list-section.ts";

/**
 * VocabList properties are the meta-data for a list, such as its name, description and tags.
 * It also contains the sections which contain the words for the list.
 * */
export const VocabList = z
  .object({
    /** If false, the list goes from 'adding' to 'reviewing' whenever a section is complete */
    autoSectionMovement: z.boolean(),

    /**
     * list of strings.
     * Usually only consists of one or two strings, the first either being "Textbooks"
     * or "Other" and the second being the series it belongs to.
     * ("official" lists only)
     */
    categories: z.array(z.string()).optional(),

    /** timestamp of when the list's contents were changed */
    changed: z.int().optional(),

    /**
     * the {@link User} id of the person who made it
     * ("custom" lists only)
     */
    creator: z.string(),

    /**
     * the {@link User} name of the person who made it
     * ("custom" lists only, must specify include_user_names)
     */
    creatorName: z.string().optional(),

    /** index of which {@link VocabListRow} in the section will be added next. Not necessarily a valid index. */
    currentIndex: z.int(),

    // If set to "not studying", all Items being studied solely from this VocabList will be disabled.
    // (mutable)
    /** id for the {@link VocabListSection} that is currently being added from, if the {@link VocabList} is being studied and it isn't finished. */
    currentSection: z.string().optional(),

    /** @deprecated in favor of "disabled" */
    deleted: z.boolean().optional(),

    /** (mutable) (long string) */
    description: z.string(),

    /** (mutable) */
    disabled: z.boolean(),

    /** list of {@link User} ids, who are allowed to edit this list */
    editors: z.array(z.string()),

    id: z.string(),
    imageURL: z.string(),

    /** (required for new lists) */
    lang: z.string(),

    /** If true, list does not add rune or tone parts for sentences in the list. */
    limitSentenceParts: z.boolean(),

    /** (required for new lists) (mutable) */
    name: z.string(),

    /** VocabList id this list was remixed from, if it was remixed */
    parent: z.string().optional(),

    /** list of parts that are being studied for this list */
    partsStudying: z.array(ItemPart),

    peopleStudying: z.int(),

    /**
     * only included if requested through `include_percent_done`, and the list is being studied.
     * @min 0
     * @max 100
     */
    percentDone: z.int().min(0).max(100).optional(),

    /** whether this list may be edited by any user or not */
    public: z.boolean(),

    /**
     * timestamp
     * ("custom" lists only)
     * */
    published: z.string().optional(),

    /** list of {@link VocabListSection}s */
    sections: z.array(VocabListSection).optional(),

    // (mutable)
    /** list of {@link VocabListSection} ids this user will not studying from */
    sectionsSkipping: z.array(z.string()),

    /** ("official" lists only) */
    shortName: z.string().optional(),

    /**
     * whether or not this is a "small" list, ie only one section.
     * (mutable only when making a new list)
     * @default false
     */
    singleSect: z.boolean(),

    sort: z.enum([
      "official",
      "custom",
      "chinesepod-lesson",
      "chinesepod-label",
    ]),

    starred: z.union([z.boolean(), z.number()]),

    /**
     * Cannot be set to "finished" directly.
     */
    studyingMode: z.enum(["not studying", "adding", "reviewing", "finished"]),

    /** list of strings */
    tags: z.array(z.string()),

    /** whether or not this list is being updated currently (ChinesePod lists only). */
    updating: z.boolean().optional(),

    user: z.string(),

    videoURL: z.string(),
  })
  .partial();

export type VocabList = z.infer<typeof VocabList>;
