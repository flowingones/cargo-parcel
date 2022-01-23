/// <reference no-default-lib="true" />
/// <reference lib="DOM" />
/// <reference lib="deno.ns" />

/* @jsx factory */

import { ElementAttributes } from "../jsx/factory.ts";
import { factory } from "../jsx/factory.ts";

import { render } from "./render.ts";

const d: Document = document;

const path = "./file.js";

export function client(
  tag: string,
  props?: ElementAttributes,
  children?: string[] | JSX.Element[],
): string {
  return "";
}
