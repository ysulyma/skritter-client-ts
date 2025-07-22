import { TargetLanguage } from "../lib/constants.ts";
import { SkritterClient } from "../lib/index.ts";
import { isKanji } from "../lib/utils.ts";

import { LocalBackend, type ShapeInitialized } from "./backend-local.ts";
import { ensureDeckCreated } from "./utils.ts";

const DB_FILE = process.cwd() + "/database.json";

const SECTION_MAX = 200;

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
    // initialize state
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

    const missingSet = {
      zh: missingFromChinese,
      ja: missingFromJapanese,
    };

    const sample = (set: Set<string>, size: number) =>
      Array.from(set).slice(0, size);

    const monthName = getMonthName();

    // loop over languages
    for (const lang of TargetLanguage.options) {
      // check state of target decks, plan how many sections to create
      const $deck = await this.client.vocabLists.getVocabList({
        id: backendState[lang].deckId,
      });

      if (!$deck.success) {
        throw new Error(`error: ${$deck.error}`);
      }

      const deck = $deck.data.VocabList;

      const matchingSections = deck
        .sections!.filter((sec) => sec.name!.startsWith(monthName))
        .sort((a, b) => a.created! - b.created!);

      // add to latest section
      const latestSection = matchingSections.at(-1)!;
      const latestIndex =
        latestSection.name! === monthName
          ? 1
          : parseInt(latestSection.name!.slice(monthName.length + " ".length));

      const missingWordsArrayUnfiltered = Array.from(missingSet[lang]);

      const missingIdsArray: string[] = [];

      if (lang === "zh") continue;

      // filter missing
      const BATCH_SIZE = 20;
      for (let i = 0; i < missingWordsArrayUnfiltered.length; i += BATCH_SIZE) {
        const $batch = await this.client.vocab.listVocabs({
          fields: "definitions,id,ilk,rareKanji",
          ids: missingWordsArrayUnfiltered
            .slice(i, i + BATCH_SIZE)
            .flatMap((word) => [
              `${lang}-${word}-0`,
              `${lang}-${word}-1`,
              `${lang}-${word}-2`,
            ])
            .join("|"),
        });

        if (!$batch.success) {
          throw new Error(`Error: ${$batch.error}`);
        }

        const batch = $batch.data.Vocabs;
        missingIdsArray.push(
          ...batch
            .filter((v) => Boolean(v.definitions?.en) && v.ilk === "word")
            .map((v) => v.id!),
        );

        // if (lang === "ja") {
        //   for (const item of batch) {
        //     if (item.rareKanji) {
        //       console.log(`Rare: ${item.id}`);
        //     }
        //     if (item.ilk !== "word") {
        //       continue;
        //     }
        //     console.log(`word: ${item.id}`);
        //   }
        //   // console.dir({ batch }, { depth: null });
        // }
      }

      // nothing to do
      if (missingIdsArray.length === 0) {
        continue;
      }

      // update current deck
      const latestSectionSize = latestSection.rows!.length;
      if (latestSectionSize < SECTION_MAX) {
        console.log(
          `[${lang}] adding ${SECTION_MAX - latestSectionSize} words to ${latestSection.name}`,
        );
        const $res = await this.client.vocabListSections.putVocabListSection(
          {
            vocabListId: deck.id!,
            sectionId: latestSection.id!,
          },
          {
            rows: [
              ...latestSection.rows!,
              ...missingIdsArray
                .splice(0, SECTION_MAX - latestSectionSize)
                .map((str) => ({ vocabId: str })),
            ],
          },
        );

        console.dir($res, { depth: null });
      }
    }
  }

  async [Symbol.asyncDispose]() {
    await this.backend.persist();
  }
}

function getMonthName() {
  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  });
  const date = new Date();

  return fmt.format(date);
}

interface SectionUpdate {
  ids: string[];
  index: number;
  sectionId: string | null;
}
