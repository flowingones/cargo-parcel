/// <reference no-default-lib="true" />
/// <reference lib="DOM" />
/// <reference lib="deno.ns" />

import "../jsx/types.ts";
import { h } from "./hydrate.ts";
import { Route, Router } from "./router.ts";

interface ParcelOptions {
  root: HTMLElement;
  routes: Route[];
}

export class P {
  constructor(private o: ParcelOptions) {
    Router.routes(o.routes);
  }

  async h(name: string): Promise<void> {
    const element = await Router.resolve(name);
    h({
      p: this.o.root,
      e: element,
    });
  }
}

export const R = Router;
