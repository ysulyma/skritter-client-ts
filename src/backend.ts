export interface Backend {
  persist(): Promise<void>;
}
