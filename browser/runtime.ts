/// <reference no-default-lib="true" />
/// <reference lib="DOM" />
/// <reference lib="deno.ns" />

import "../jsx/types.ts";
import { h } from "./render.ts";
import { Router } from "./router.ts";

interface Route {
  path: string;
}

interface ParcelOptions {
  root: HTMLElement;
  routes: Route[];
}

export class P {
  constructor(private o: ParcelOptions) {}

  async h(name: string): Promise<void> {
    const element = await Router.resolve(name);
    h({
      p: this.o.root,
      e: element,
    });
  }
}
