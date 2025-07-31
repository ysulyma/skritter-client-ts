import * as fsp from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";

import { TargetLanguage } from "../lib/constants.ts";
import { Item, SkritterClient } from "../lib/index.ts";
import { isKanji } from "../lib/utils.ts";

const languages = {
  ja: "Japanese",
  zh: "Chinese",
};

import { LocalBackend, type ShapeInitialized } from "./backend-local.ts";
import { flags } from "./flags.ts";
import { ensureDeckCreated, formatPinyin } from "./utils.ts";

const DB_FILE = process.cwd() + "/database.json";

const jobs = {
  syncWriting: {
    name: "syncWriting",
    version: "1",
  },
};

const SECTION_MAX = 200;

interface AppOptions {
  apiKey: string;

  /** download from https://cantonese.org/download.html */
  cantoneseReadings?: string;
  dbFile: string;
}

interface CantoEntry {
  jyutping: string;
  pinyin: string;
  simple: string;
  trad: string;
  defn: string;
}

export class App implements AsyncDisposable {
  // backend: LocalBackend;
  canto: Map<string, string>;
  client: SkritterClient;
  db: DatabaseSync;

  #cantoFile: string | undefined;

  constructor({ apiKey, cantoneseReadings, dbFile }: AppOptions) {
    // this.backend = new LocalBackend({ filename: DB_FILE });
    this.canto = new Map();
    this.client = new SkritterClient(apiKey);

    this.db = new DatabaseSync(dbFile);
    this.#cantoFile = cantoneseReadings;
  }

  #log(...messages: unknown[]) {
    console.log(...messages);
  }

  async init() {
    await this.#initializeDatabase();
    await this.#initializeCantoDictionary();
  }

  async #initializeCantoDictionary() {
    if (!this.#cantoFile) return;

    const file = await fsp.readFile(this.#cantoFile, "utf8");
    const lines = file.split("\n");

    for (const line of lines) {
      if (line.startsWith("#") || !line) {
        continue;
      }

      const $_ = line.match(
        /^(?<trad>.+?) (?<simp>.+?) \[(?<pinyin>.*?)\] \{(?<jyutping>.+?)\}$/,
        // /^(?<trad>.+?) (?<simp>.+?) \[(?<pinyin>.*?)\] \{(?<jyutping>.+?)\} \/(?<defn>.+?)\/(?:\s*#.*)?$/,
      );
      if (!$_) {
        console.error({ error: line });
        return;
      }

      const entry = { ...$_.groups } as unknown as CantoEntry;

      this.canto.set(entry.simple, entry.jyutping);
      this.canto.set(entry.trad, entry.jyutping);
    }
  }

  async syncWriting(word: string) {
    const saveJob = this.db.prepare(
      `INSERT INTO jobs (name, version, "key", result) VALUES (:name, :version, :key, :result)`,
    );

    // get vocabs
    const [$chineseVocabs, $japaneseVocabs] = await Promise.all([
      this.client.vocab.listVocabs({ lang: "zh", q: word }),
      this.client.vocab.listVocabs({ lang: "ja", q: word }),
    ]);

    if (!($chineseVocabs.success && $japaneseVocabs.success)) {
      return;
    }
    const [chineseVocabs, japaneseVocabs] = [
      $chineseVocabs.data.Vocabs,
      $japaneseVocabs.data.Vocabs,
    ];

    const chineseVocab = chineseVocabs.at(0);
    const japaneseVocab = japaneseVocabs.at(0);

    // readings
    const mandarinReadings = new Set(
      chineseVocabs.filter((_) => _.reading).map((_) => _.reading!),
    );

    const mandarinReading =
      mandarinReadings.size === 1 ? [...mandarinReadings][0] : null;

    const pinyin = mandarinReading
      ?.split(" ")
      .map((chunk) => chunk.split(",").map(formatPinyin).join(","))
      .join(" ");

    const japaneseReadings = new Set(
      japaneseVocabs.filter((_) => _.reading).map((_) => _.reading!),
    );
    const japaneseReading =
      japaneseReadings.size === 1 ? [...japaneseReadings][0] : null;

    const cantoReading = this.canto.get(word);

    // update Chinese
    if (chineseVocab && (japaneseReading || cantoReading)) {
      // build custom definition
      const customDefinition = [chineseVocab.definitions!.en];
      if (japaneseReading) {
        customDefinition.push(`${flags.ja} ${japaneseReading}`);
      }

      if (cantoReading) {
        customDefinition.push(`${flags.hk} ${cantoReading}`);
      }

      // API call
      await this.client.vocab.updateVocab(
        { id: chineseVocab.id! },
        {
          ...chineseVocab,
          customDefinition: customDefinition.join("\n"),
        },
      );
    }

    // update Japanese
    if (japaneseVocab && (mandarinReading || cantoReading)) {
      // build custom definition
      const customDefinition = [japaneseVocab.definitions!.en];
      if (pinyin) {
        customDefinition.push(`${flags.zh} ${pinyin}`);
      }

      if (cantoReading) {
        customDefinition.push(`${flags.hk} ${cantoReading}`);
      }

      // call API
      await this.client.vocab.updateVocab(
        { id: japaneseVocab.id! },
        {
          ...japaneseVocab,
          customDefinition: customDefinition.join("\n"),
        },
      );
    }

    console.log(
      // biome-ignore lint/style/useTemplate: <>
      [
        word,
        ...(pinyin ? [`${flags.zh} ${pinyin}`] : []),
        ...(japaneseReading ? [`${flags.ja} ${japaneseReading}`] : []),
        ...(cantoReading ? [`${flags.hk} ${cantoReading}`] : []),
      ].join("\n") + "\n",
    );

    saveJob.run({
      ...jobs.syncWriting,
      key: word,

      // biome-ignore assist/source/useSortedKeys: don't want them sorted in the db
      result: JSON.stringify({
        mandarin: [...mandarinReadings],
        japanese: [...japaneseReadings],
        canto: cantoReading,
      }),
    });
    return;
  }

  async sync() {
    for (const lang of TargetLanguage.options) {
      console.log(`Syncing ${languages[lang]} items`);
      const $$pages = this.client.paginated(this.client.items.listItems)({
        ids_only: true,
        lang,
        limit: 1000,
      });

      // Create a prepared statement to read data from the database.
      const selectItemIds = this.db.prepare(
        "SELECT id FROM sk_items WHERE lang = :lang",
      );

      // Execute the prepared statement and log the result set.
      const knownIds = new Set(
        selectItemIds.all({ lang }).map((row) => row.id),
      );

      console.log(`Already know ${knownIds.size} items in ${languages[lang]}`);

      const newIds: string[] = [];

      for await (const $page of $$pages) {
        // unwrap
        if (!$page.success) {
          console.error($page);
          continue;
        }

        // get new items
        const page = $page.data;

        newIds.push(
          ...page.Items.map((item) => item.id!).filter(
            (id) => !knownIds.has(id),
          ),
        );
      }

      console.log(`Found ${newIds.length} new items in ${languages[lang]}`);

      // chunk size is small due to URL limits
      const CHUNK_SIZE = 20;
      for (let i = 0; i < newIds.length; i += CHUNK_SIZE) {
        const slice = newIds.slice(i, i + CHUNK_SIZE);

        const $items = await this.client.items.listItems({
          ids: slice.join("|"),
        });

        if (!$items.success) {
          console.error($items.error);
          continue;
        }
        const items = $items.data.Items;

        const fields = Item.keyof().options;

        const insert = this.db.prepare(
          `INSERT INTO sk_items
           (
             changed, created, id, interval, lang, last, next, part, previousInterval,
             previousSuccess, reviews, style, successes, timeStudied, raw
           ) VALUES (
             :changed, :created, :id, :interval, :lang, :last, :next, :part, :previousInterval,
             :previousSuccess, :reviews, :style, :successes, :timeStudied, :raw
           )`,
        );

        for (const item of items) {
          console.dir(item);
          insert.run({
            changed: item.changed!,
            created: item.created!,
            id: item.id!,
            interval: item.interval ?? null,
            lang: item.lang ?? null,
            last: item.last ?? null,
            next: item.next ?? null,
            part: item.part ?? null,
            previousInterval: item.previousInterval ?? null,
            previousSuccess: item.previousSuccess ? 1 : 0,
            raw: JSON.stringify(item),
            reviews: item.reviews ?? null,
            style: item.style ?? null,
            successes: item.successes ?? null,
            timeStudied: item.timeStudied ?? null,
          });
        }
      }
    }
  }

  async #initializeDatabase() {
    // create tables
    await Promise.all(
      ["./src/tables/jobs.sql", "./src/tables/sk_items.sql"].map(
        async (filename) => {
          const sql = await fsp.readFile(filename, "utf8");
          this.db.exec(sql);
        },
      ),
    );
  }

  async ensureInitialized() {
    // await this.backend.init();
    // if (!this.backend.state.initialized) {
    //   await this.initialSync();
    // }
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
        .filter((v) => v.writing?.split("").every(isKanji))
        .map((v) => v.writing!),
    );

    console.log(`${knownChinese.size} Chinese, ${knownJapanese.size} Japanese`);

    // compute missing characters
    const missingFromChinese = knownJapanese.difference(knownChinese);
    const missingFromJapanese = knownChinese.difference(knownJapanese);

    const missingSet = {
      ja: missingFromJapanese,
      zh: missingFromChinese,
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
            sectionId: latestSection.id!,
            vocabListId: deck.id!,
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
