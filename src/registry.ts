import type { VComponent } from "./ast.ts";

interface CompontentsCache {
  toCreate: VComponent<unknown>[];
}

export const componentsCache: CompontentsCache = {
  toCreate: [],
};
