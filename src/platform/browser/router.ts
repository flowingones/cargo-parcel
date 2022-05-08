import "../../jsx/types.ts";

import * as Framwork from "../../__framework.ts";

export interface Route {
  path: string;
  data?: unknown;
}

const _routes: Route[] = [];

async function load(path: string): Promise<JSX.Element> {
  const component = await import(`/${path}.js`);

  component["setFramework"](Framwork);

  console.log(component);

  return <JSX.Element> Framwork.tag(component[path], null, []);
}

async function resolve(path: string): Promise<JSX.Element> {
  const toResolve = _routes.find((route) => {
    return route.path === path;
  });
  if (toResolve) {
    return await load(toResolve.path);
  }
  throw new Error("No route found!");
}

function goto(path: string) {
  console.log(path);
  throw new Error("Not implemented yet!");
}

function routes(routes?: Route[]) {
  if (Array.isArray(routes)) {
    _routes.push(...routes);
  }
  return _routes;
}

function current(): string {
  return window.location.pathname.replace(/^\//, "");
}

export const Router = {
  resolve,
  goto,
  routes,
  current,
};
