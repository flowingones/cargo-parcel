import type { VComponent } from "./ast.ts";

interface CompontentsCache {
  toCreate: VComponent[];
}

export const componentsCache: CompontentsCache = {
  toCreate: [],
};
