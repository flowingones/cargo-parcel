import { denoPlugin, esbuild } from "./deps.ts";

interface BundleProps {
  entryPoints: Record<string, string>;
}

let esbuildInit = false;

export async function bundle(props: BundleProps) {
  if (Deno.run === undefined && !esbuildInit) {
    await esbuild.initialize({
      wasmURL: "https://deno.land/x/esbuild@v0.17.0/esbuild.wasm",
      worker: false,
    });
    esbuildInit = true;
  }

  const result = await esbuild.build({
    /*
       * Supress error in esbuild 15.x
       @ts-ignore */
    plugins: [denoPlugin({
      importMapURL: new URL("./import_map.json", `file://${Deno.cwd()}/`),
    })],
    entryPoints: props.entryPoints,
    bundle: true,
    format: "esm",
    treeShaking: true,
    splitting: true,
    outdir: ".",
    minify: true,
    platform: "neutral",
    write: false,
    jsxFactory: "tag",
    absWorkingDir: Deno.cwd(),
    target: ["chrome99", "firefox99", "safari15"],
  });

  return result.outputFiles;
}
