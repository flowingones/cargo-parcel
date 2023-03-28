import { parse } from "std/path/mod.ts";
import { isProd } from "cargo/utils/environment.ts";
import { denoPlugin, esbuild } from "./deps.ts";
import { BUILD_ID } from "./mod.ts";

let isInitialized: boolean | Promise<void> = false;

async function initialize() {
  if (isInitialized === false) {
    if (Deno.run === undefined) {
      const wasmURL = new URL("./esbuild.v17.0.0.wasm", import.meta.url).href;
      isInitialized = fetch(wasmURL).then(async (r) => {
        const resp = new Response(r.body, {
          headers: { "Content-Type": "application/wasm" },
        });
        const wasmModule = await WebAssembly.compileStreaming(resp);
        await esbuild.initialize({
          wasmModule,
          worker: false,
        });
      });
    } else {
      isInitialized = esbuild.initialize({});
    }
    await isInitialized;
    isInitialized = true;
  } else if (isInitialized instanceof Promise) {
    await isInitialized;
  }
}

export class Bundler {
  private files:
    | undefined
    | Map<string, Uint8Array>
    | Promise<void>;

  constructor(
    private entryPoints: Record<string, string>,
  ) {}

  async bundle(): Promise<void> {
    await initialize();

    const result = await esbuild.build({
      /*
         * Supress error in esbuild 15.x
         @ts-ignore */
      plugins: [denoPlugin({
        importMapURL: new URL("./import_map.json", `file://${Deno.cwd()}/`),
      })],
      entryPoints: this.entryPoints,
      bundle: true,
      format: "esm",
      treeShaking: true,
      splitting: true,
      outdir: ".",
      minify: isProd(),
      platform: "neutral",
      write: false,
      jsxFactory: "tag",
      absWorkingDir: Deno.cwd(),
      target: ["chrome99", "firefox99", "safari15"],
    });

    const files = new Map<string, Uint8Array>();

    result.outputFiles?.forEach((file) => {
      files.set(parse(file.path).base.replaceAll("$", ""), file.contents);
    });

    this.files = files;
    return;
  }

  async cache() {
    if (typeof this.files === "undefined") {
      this.files = this.bundle();
    }
    if (this.files instanceof Promise) {
      await this.files;
    }

    return <Map<string, Uint8Array>> this.files;
  }

  async resolve(fileName: string): Promise<Uint8Array | undefined> {
    return (await this.cache()).get(fileName);
  }
}

export const bundlerAssetRoute = `/_parcel/${BUILD_ID}`;
