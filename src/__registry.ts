import type { VComponent } from "./ast.ts";

interface CompontentsCache {
  toCreate: VComponent[];
  toUpdate: VComponent[];
  toDelete: VComponent[];
}

export const componentsCache: CompontentsCache = {
  toCreate: [],
  toUpdate: [],
  toDelete: [],
};

export const components: VComponent[] = [];
