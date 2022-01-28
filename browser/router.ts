/* @jsx factory */

/// <reference lib="DOM" />
import "../jsx/types.ts";

declare const routes: Route[];

interface Route {
  path: string;
  data: unknown;
}

const _routes: Route[] = [];

async function load(p: string): Promise<JSX.Component> {
  const c = await import(`/${p}.js`);
  return <JSX.Component> c[c];
}

function resolve(path: string) {
  const toResolve = _routes.find((route) => {
    return route.path === path;
  });
  if (toResolve) {
    return load(toResolve.path);
  }
}

export function goto(path: string) {}
