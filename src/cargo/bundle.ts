import { denoPlugin, esbuild } from "./deps.ts";

interface BundleProps {
  pages: Record<string, JSX.Node>;
  islands: Record<string, JSX.Node>;
}

export async function bundle(props: BundleProps) {
  const entryPoints: string[] = [];

  for (const page in props.pages) {
    entryPoints.push(`./pages${page}.tsx`);
  }

  for (const island in props.islands) {
    entryPoints.push(`./${island}`);
  }

  console.log(Deno.cwd());

  console.log(
    (await esbuild.build({
      /*
       * Supress error in esbuild 15.x
       @ts-ignore */
      plugins: [denoPlugin({
        importMapURL: new URL("./import_map.json", `file://${Deno.cwd()}`),
      })],
      entryPoints,
      bundle: true,
      format: "esm",
      treeShaking: true,
      splitting: true,
      outdir: ".",
      write: false,
      jsxFactory: "tag",
      absWorkingDir: Deno.cwd(),
      target: ["chrome99", "firefox99", "safari15"],
    })).outputFiles.forEach((file) => {
      console.log(file.path);
    }),
  );
}
