import "dotenv/config";

import type { TargetLanguage } from "../lib/constants.ts";
import { isKanji } from "../lib/utils.ts";

import { App } from "./app.ts";

const API_KEY = process.env.API_KEY as string;

await main();

async function main() {
  const app = new App({
    apiKey: API_KEY,
    cantoneseReadings: "./canto-readings.txt",
    dbFile: "./database.sqlite3",
  });

  await app.init();

  await app.sync();

  // get words that have already been included
  const selectJobs = app.db.prepare(
    "SELECT key FROM jobs WHERE name = :name AND version = :version",
  );
  const completedJobs = selectJobs.all({ name: "syncWriting", version: "1" });
  const completedKeys = new Set(completedJobs.map((row) => row.key));

  // find words to sync
  const characters = new Set<string>();
  const selectItems = app.db.prepare("SELECT id FROM sk_items");
  for (const row of selectItems.all()) {
    const $_ = (row.id as string).match(
      /^\d+-(?:ja|zh)-(.+)-\d+-(?:defn|rdng|rune|tone)$/,
    );
    if (!$_) {
      throw new Error(`error: ${row.id}`);
    }

    const writing = $_[1];
    if (!writing.split("").every(isKanji)) {
      continue;
    }

    if (completedKeys.has(writing)) {
      continue;
    }

    characters.add(writing);
  }

  // do in serial to avoid rate limits
  for (const word of characters.values()) {
    await app.syncWriting(word);
  }

  return;

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
