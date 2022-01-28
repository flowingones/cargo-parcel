/// <reference no-default-lib="true" />
/// <reference lib="DOM" />
/// <reference lib="deno.ns" />

import "../jsx/types.ts";

interface Route {
  path: string;
}

interface ParcelOptions {
  root: Node;
  routes: Route[];
}

export class P {
  constructor(o: ParcelOptions) {
    console.log(o);
  }
}
