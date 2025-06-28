import z from "zod/v4";

import { ItemPart } from "../constants.ts";

/**
 * VocabList properties are the meta-data for a list, such as its name, description and tags.
 * It also contains the sections which contain the words for the list.
 * */
export const VocabList = z.object({
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

  /** @deprecated in favor of "disabled" */
  deleted: z.boolean().optional(),

  /** (mutable) (long string) */
  description: z.string(),

  /** (mutable) */
  disabled: z.boolean(),

  id: z.string(),

  /** (required for new lists) */
  lang: z.string(),

  /** If true, list does not add rune or tone parts for sentences in the list. */
  limitSentenceParts: z.boolean(),

  /** (required for new lists) (mutable) */
  name: z.string(),

  /** VocabList id this list was remixed from, if it was remixed */
  parent: z.string().optional(),

  /** whether or not this list is being updated currently (ChinesePod lists only). */
  // updating: string;
  /** whether or not this is a "small" list, ie only one section. */
  // singleSect: string;
  // (mutable only when making a new list) (default: false)
  /** list of strings */
  // tags: string;
  // (mutable)
  /** list of User ids, who are allowed to edit this list */
  // editors: string;
  // (mutable)
  /** whether this list may be edited by any user or not */
  // public: string;
  // (mutable) (default: false)
  /** integer */
  // peopleStudying: string;
  /** "not studying", "adding", "reviewing" or "finished" */
  // studyingMode: string;
  // Cannot be set to "finished" directly.
  // If set to "not studying", all Items being studied solely from this VocabList will be disabled.
  // (mutable)
  /** id for the VocabListSection that is currently being added from, if the VocabList is being studied and it isn't finished. */
  // currentSection: string;
  // (mutable)
  /** index of which VocabListRow in the section will be added next. Not necessarily a valid index. */
  // currentIndex: string;
  // (mutable)
  /** list of VocabListSection ids this user will not studying from */
  // sectionsSkipping: string;
  // (mutable)
  /** If false, the list goes from 'adding' to 'reviewing' whenever a section is complete */
  // autoSectionMovement: string;
  // (mutable) (default: true)
  /** list of VocabListSections */
  // sections: string;
  // (mutable)
  /** list of parts that are being studied for this list */
  partsStudying: z.array(ItemPart),

  /**
   * only included if requested through `include_percent_done`, and the list is being studied.
   * @min 0
   * @max 100
   */
  percentDone: z.int().min(0).max(100).optional(),

  /**
   * timestamp
   * ("custom" lists only)
   * */
  published: z.string().optional(),

  /** ("official" lists only) */
  shortName: z.string().optional(),

  sort: z.enum(["official", "custom", "chinesepod-lesson", "chinesepod-label"]),
  // (integer between 0 and 100)
});

export type VocabList = z.infer<typeof VocabList>;
