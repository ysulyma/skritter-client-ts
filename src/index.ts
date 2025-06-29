import "dotenv/config";

import * as fsp from "node:fs/promises";

import type { TargetLanguage } from "../lib/constants.ts";
import { SkritterClient, type VocabList } from "../lib/index.ts";
import { isKanji } from "../lib/utils.ts";

const API_KEY = process.env.API_KEY as string;

const client = new SkritterClient(API_KEY);

await syncCharacters();

/**
 * Sync characters between Chinese and Japanese study
 */
async function syncCharacters() {
  // create the decks
  const chineseDeck = await ensureDeckCreated("zh", "日文");
  // const japaneseDeck = await ensureDeckCreated("ja", "中国語");

  // const knownChinese = await getAllKnownCharacters("zh");
  // const knownJapanese = await getAllKnownCharacters("ja");
  //
  // await fsp.writeFile(
  //   "./chinese.json",
  //   JSON.stringify(Array.from(knownChinese.values())),
  // );
  // await fsp.writeFile(
  //   "./japanese.json",
  //   JSON.stringify(Array.from(knownJapanese.values())),
  // );
  const knownChinese = new Set<string>(
    JSON.parse(await fsp.readFile("./chinese.json", "utf-8")),
  );
  const knownJapanese = new Set<string>(
    JSON.parse(await fsp.readFile("./japanese.json", "utf-8")).filter(isKanji),
  );

  // compute missing characters
  const missingFromChinese = knownJapanese.difference(knownChinese);
  // const missingFromJapanese = knownChinese.difference(knownJapanese);

  // create new section
  const deck = chineseDeck;
  const updatedDeck = await ensureSection(deck);
  // const section = updatedDeck.sections!.at(-1);

  // add characters
  for (const character of missingFromChinese) {
    const $vocabs = await client.vocab.listVocabs({
      q: character,
      fields: "id",
    });
    if (!$vocabs.success) {
      console.dir($vocabs);
      continue;
    }

    const vocabs = $vocabs.data.Vocabs;
    if (vocabs.length > 1) {
      console.dir({ tooManyVocabs: vocabs });
    }
  }
}

async function ensureSection(deck: VocabList): Promise<VocabList> {
  const chunkSize = 200;

  return deck;
}

/**
 * Get or create a deck.
 */
async function ensureDeckCreated(
  lang: TargetLanguage,
  deckName: string,
): Promise<VocabList> {
  const items = client.paginated(client.vocabLists.listVocabLists)({
    lang: "zh",
    sort: "custom",
  });

  // see if deck already exists
  for await (const $res of items) {
    if (!$res.success) continue;

    const res = $res.data;

    for (const vocabList of res.VocabLists) {
      if (vocabList.name === deckName) {
        // get the full item
        const $res = await client.vocabLists.getVocabList(
          { id: vocabList.id },
          { fields: "id" },
        );

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
 * Get all the known characters in a language.
 */
async function getAllKnownCharacters(lang: TargetLanguage) {
  const known = new Set<string>();

  let i = 0;

  // find all known characters
  const $$pages = client.paginated(client.items.listItems)({
    fields: "",
    include_vocabs: true,
    lang,
    vocab_fields: "ilk,writing",
  });

  for await (const $page of $$pages) {
    console.log(`page ${i++}, ${known.size}`);
    if (!$page.success) {
      console.error($page);
      continue;
    }

    const page = $page.data;

    for (const vocab of page.Vocabs!) {
      if (vocab.ilk !== "char") continue;

      known.add(vocab.writing!);
    }
  }

  return known;
}
