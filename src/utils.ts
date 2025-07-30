import type { SkritterClient, VocabList } from "../lib";
import type { TargetLanguage } from "../lib/constants.ts";

/**
 * Add missing characters.
 */
export async function addCharacters(
  client: SkritterClient,
  deck: VocabList,
  missing: Set<string>,
) {
  const section = deck.sections!.at(-1)!;

  // add characters
  const newRows = (
    await Promise.all(
      Array.from(missing)
        .slice(0, 20)
        .map(async (char) => {
          const $vocabs = await client.vocab.listVocabs({
            fields: "id",
            lang: deck.lang!,
            q: char,
          });

          if (!$vocabs.success) throw new Error();

          const vocabs = $vocabs.data;

          const vocabId = vocabs.Vocabs.at(0)?.id;

          if (vocabId === undefined) return undefined;

          return { vocabId };
        }),
    )
  ).filter(Boolean);

  await client.vocabListSections.putVocabListSection(
    {
      sectionId: section.id!,
      vocabListId: deck.id!,
    },
    {
      rows: [...(section.rows ?? []), ...newRows],
    },
  );
}

/**
 * Get or create a deck.
 */
export async function ensureDeckCreated(
  client: SkritterClient,
  lang: TargetLanguage,
  deckName: string,
): Promise<VocabList> {
  const listVocabListsPaginated = client.paginated(
    client.vocabLists.listVocabLists,
  );
  const items = listVocabListsPaginated({
    lang,
    sort: "custom",
  });

  // see if deck already exists
  for await (const $res of items) {
    if (!$res.success) continue;

    const res = $res.data;

    for (const vocabList of res.VocabLists) {
      if (vocabList.name === deckName) {
        // get the full item
        const $res = await client.vocabLists.getVocabList({
          id: vocabList.id!,
        });

        if (!$res.success) throw new Error();

        return $res.data.VocabList;
      }
    }
  }

  // create new deck
  const $res = await client.vocabLists.createVocabList({
    lang,
    name: deckName,
  });

  if (!$res.success) {
    throw new Error(`failed to create deck "${deckName}" in ${lang}`);
  }

  return $res.data.VocabList;
}

/**
 * Omit certain fields from an object.
 * @param obj Object to omit fields from.
 * @param keys Keys to omit.
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  return Object.fromEntries(
    (Object.keys(obj) as (keyof T)[])
      .filter((key) => !(keys as (keyof T)[]).includes(key))
      .map((key) => [key, obj[key]]),
  ) as Omit<T, K>;
}

/**
 * Get only specific fields from an object.
 * @param obj Object to pick fields from.
 * @param keys Keys to pick.
 */
export function pick<T, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> {
  return Object.fromEntries(
    keys.map((key) => [key, obj[key] ?? null] as [K, T[K]]),
  ) as Pick<T, K>;
}
