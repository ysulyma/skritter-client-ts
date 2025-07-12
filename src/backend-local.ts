import * as fsp from "node:fs/promises";

import type { Vocab } from "../lib/index.ts";

import type { Backend } from "./backend.ts";

interface LocalBackendOptions {
  filename: string;
}

export interface ShapeUninitialized {
  initialized: false;
}

interface LanguageStorage {
  deckId: string;
  itemIds: string[];
  vocabs: Record<string, Pick<Vocab, "ilk" | "writing" | "id">>;
}

export interface ShapeInitialized {
  initialized: true;
  zh: LanguageStorage;
  ja: LanguageStorage;
}

type Shape = ShapeUninitialized | ShapeInitialized;

const initialState = {
  initialized: false,
} satisfies Shape;

export class LocalBackend implements Backend {
  #filename: string;
  #initialized: boolean;
  state: Shape;

  constructor(options: LocalBackendOptions) {
    this.#filename = options.filename;
    this.#initialized = false;
  }

  async init() {
    // idempotent
    if (this.#initialized) {
      return;
    }

    try {
      const file = await fsp.readFile(this.#filename, "utf8");
      this.state = JSON.parse(file);
    } catch (e) {
      this.state = initialState;
    }

    this.#initialized = true;
  }

  async persist() {
    const data = JSON.stringify(this.state, null, 2);
    await fsp.writeFile(this.#filename, data);
  }
}
