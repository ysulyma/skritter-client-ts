import "dotenv/config";

import type { TargetLanguage } from "../lib/constants.ts";

import { App } from "./app.ts";

const API_KEY = process.env.API_KEY as string;

await main();

async function main() {
  const app = new App({
    apiKey: API_KEY,
  });

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
