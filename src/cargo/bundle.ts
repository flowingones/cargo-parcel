import { denoPlugin, esbuild } from "./deps.ts";

interface BundleProps {
  islands: Record<string, JSX.Node>;
}

export async function bundle(props: BundleProps) {
  const entryPoints: string[] = [];

  for (const island in props.islands) {
    entryPoints.push(`./${island}`);
  }

  console.log(
    (await esbuild.build({
      /*
       * Supress error in esbuild 15.x
       @ts-ignore */
      plugins: [denoPlugin({
        importMapURL: new URL("./import_map.json", `file://${Deno.cwd()}/`),
      })],
      entryPoints,
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
    })).outputFiles.forEach((file) => {
      console.log(file.text);
    }),
  );
}
