import * as esbuildNative from "https://deno.land/x/esbuild@v0.18.20/mod.js";
import * as esbuildWasm from "https://deno.land/x/esbuild@v0.18.20/wasm.js";
export { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.8.1/mod.ts";

// TODO: Refactor to not rely on deprecated Deno.run
const esbuild = Deno.run === undefined ? esbuildWasm : esbuildNative;

export { esbuild };
