export { vNodeToString } from "../platform/server/mod.ts";
export {
  create,
  tag,
  type VComponent,
  type VElement,
  type VNode,
  VType,
} from "../mod.ts";
import * as esbuildNative from "https://deno.land/x/esbuild@v0.17.0/mod.js";
import * as esbuildWasm from "https://deno.land/x/esbuild@v0.17.0/wasm.js";
export { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.5.2/mod.ts";

const esbuild = Deno.run === undefined ? esbuildWasm : esbuildNative;

export { esbuild };
