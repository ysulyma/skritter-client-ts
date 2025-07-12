import { SkritterClient } from "../lib/index.ts";
import { TargetLanguage } from "../lib/constants.ts";

import { LocalBackend, type ShapeInitialized } from "./backend-local.ts";
import { ensureDeckCreated } from "./utils.ts";
import { isKanji } from "../lib/utils.ts";

const DB_FILE = process.cwd() + "/database.json";

interface AppOptions {
  apiKey: string;
}

export class App implements AsyncDisposable {
  backend: LocalBackend;
  client: SkritterClient;

  constructor({ apiKey }: AppOptions) {
    this.backend = new LocalBackend({ filename: DB_FILE });
    this.client = new SkritterClient(apiKey);
  }

  #log(...messages: unknown[]) {
    console.log(...messages);
  }

  async ensureInitialized() {
    await this.backend.init();

    if (!this.backend.state.initialized) {
      await this.initialSync();
    }
  }

  async initialSync() {
    this.#log("Initial sync");

    const backendState = this.backend.state as ShapeInitialized;

    // get/create the decks
    const chineseDeck = await ensureDeckCreated(
      this.client,
      "zh",
      "Japanese Sync",
    );
    const japaneseDeck = await ensureDeckCreated(
      this.client,
      "ja",
      "Chinese Sync",
    );

    backendState.ja = {
      deckId: japaneseDeck.id!,
      itemIds: [],
      vocabs: {},
    };

    backendState.zh = {
      deckId: chineseDeck.id!,
      itemIds: [],
      vocabs: {},
    };

    // get all items
    for (const lang of TargetLanguage.options) {
      const $$pages = this.client.paginated(this.client.items.listItems)({
        fields: "id",
        include_vocabs: true,
        lang,
        parts: "rune",
        sort: "next",
        vocab_fields: "id,ilk,writing",
      });

      let pageNumber = 0;

      for await (const $page of $$pages) {
        if (!$page.success) {
          console.error($page);
          continue;
        }

        const page = $page.data;

        this.#log(
          `[${lang}] Page ${pageNumber}, ${page.Items!.length} items, ${page.Vocabs!.length} vocabs`,
        );
        pageNumber++;

        for (const item of page.Items) {
          backendState[lang].itemIds.push(item.id!);
        }

        for (const vocab of page.Vocabs!) {
          backendState[lang].vocabs[vocab.id!] = vocab;
        }
      }
    }

    backendState.initialized = true;
  }

  // async getNewItems() {
  //   for (const lang of TargetLanguage.options) {
  //     const idSet = new Set<string>();
  //
  //     const $pages = this.client.paginated(this.client.items.listItems)({
  //       ids_only: true,
  //       lang,
  //     });
  //
  //     for await (const $page of $pages) {
  //       if (!$page.success) {
  //         console.error("server error", $page);
  //         process.exit(1);
  //       }
  //
  //       for (const { id } of $page.data.Items) {
  //         idSet.add(id!);
  //       }
  //     }
  //
  //     const langState = backend.state[lang];
  //
  //     const existingIdSet = new Set(langState.itemIds);
  //
  //     const newIdSet = idSet.difference(existingIdSet);
  //
  //     console.log(`Processing ${newIdSet.size} new Items for ${lang}`);
  //
  //     for (const newItemId of newIdSet) {
  //       langState.itemIds.push(newItemId);
  //     }
  //   }
  // }

  /**
   * Sync characters between Chinese and Japanese study
   */
  async syncCharacters() {
    const backendState = this.backend.state as ShapeInitialized;

    const knownChinese = new Set(
      Object.values(backendState.zh.vocabs).map((v) => v.writing!),
    );

    const knownJapanese = new Set(
      Object.values(backendState.ja.vocabs)
        .filter((v) => v.writing && v.writing.split("").every(isKanji))
        .map((v) => v.writing!),
    );

    console.log(`${knownChinese.size} Chinese, ${knownJapanese.size} Japanese`);

    // compute missing characters
    const missingFromChinese = knownJapanese.difference(knownChinese);
    const missingFromJapanese = knownChinese.difference(knownJapanese);

    const sample = (set: Set<string>, size: number) =>
      Array.from(set).slice(0, size);

    this.#log(
      `${missingFromChinese.size} missing from Chinese: ${sample(missingFromChinese, 3)}...
${missingFromJapanese.size} missing from Japanese: ${sample(missingFromJapanese, 3)}...
`,
    );
  }

  async [Symbol.asyncDispose]() {
    await this.backend.persist();
  }
}
