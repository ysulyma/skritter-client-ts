import "dotenv/config";

import type { TargetLanguage } from "../lib/constants.ts";

import { App } from "./app.ts";
import { error } from "node:console";
import { isKanji } from "../lib/utils.ts";

const API_KEY = process.env.API_KEY as string;

await main();

async function main() {
  const app = new App({
    apiKey: API_KEY,
    dbFile: "./database.sqlite3",
  });

  await app.init();
  await app.initializeCantoDictionary("./canto-readings.txt");

  await app.syncWriting("客户");

  // character dictionary
  const characters = new Set<string>();
  const selectItems = app.db.prepare("SELECT id FROM items LIMIT 1000");
  for (const row of selectItems.all()) {
    const $_ = (row.id as string).match(
      /^\d+-(?:ja|zh)-(.+)-\d+-(?:defn|rdng|rune|tone)$/,
    );
    if (!$_) {
      throw new Error(`error: ${row.id}`);
    }

    const writing = $_[1];
    if (writing.split("").every(isKanji)) {
      characters.add($_[1]);
    }
  }

  await Promise.all(characters.values().map((word) => app.syncWriting(word)));

  return;

  await app.sync();

  const $simpTradMap = await app.client.simpTradMap.getSimpTradMap();

  if (!$simpTradMap.success) {
    console.error($simpTradMap.error);
    return;
  }

  const simpTradMap = $simpTradMap.data.SimpTradMap;

  console.log(JSON.stringify(simpTradMap).length);

  return;

  await app.ensureInitialized();

  await app.syncCharacters();

  // Node doesn't support `await using` yet
  await app[Symbol.asyncDispose]();
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
