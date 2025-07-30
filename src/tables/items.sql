  CREATE TABLE IF NOT EXISTS items (
    changed INTEGER, -- timestamp of when this item was last altered in any way
    created INTEGER, -- timestamp of when this item was created
    id TEXT PRIMARY KEY,
    interval INTEGER, -- number of seconds it was originally scheduled for (so not necessarily next - last, if last has been changed since)
    lang TEXT NOT NULL,
    last INTEGER, -- timestamp of when it was last studied.
    next INTEGER, -- timestamp of when it's due
    part TEXT NOT NULL,
    previousInterval INTEGER, -- integer, the interval value prior to the last review
    previousSuccess INTEGER, -- boolean, whether the last review had a score greater than 1
    reviews INTEGER, -- number of times this item has been reviewed
    -- sectionIds z.array(TEXT ).optional(), -- list of VocabListSection ids from which the word was added. This list parallels vocabListIds.
    style TEXT NOT NULL,
    successes INTEGER, -- number of times this item was scored 2 or higher
    timeStudied INTEGER, -- total time spent studying this item in seconds
    -- vocabIds z.array(TEXT ).optional(), -- list of Vocab ids that this item 'covers' for this user.
    -- vocabListIds z.array(TEXT ).optional(), -- list of VocabList ids from which this item was added
    raw TEXT
  ) STRICT;
