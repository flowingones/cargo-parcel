/* @jsx factory */
/// <reference lib="DOM" />

import { factory } from "../jsx/factory.ts";

interface Route {
  pattern: string;
  ast: JSX.Element;
}

const routes: Route[] = [];
