import { join, parse } from "std/path/mod.ts";
import { Bundler, type EntryPoints } from "../bundler/bundler.ts";
import { EOL } from "https://deno.land/std@0.173.0/fs/mod.ts";

type Script = [string, string];

type ScriptManifestConfig = {
  path: string;
  manifestPath: string;
  entryPoints: EntryPoints;
  isProd?: boolean;
};

export async function scriptsManifest(
  config: ScriptManifestConfig,
) {
  const _scripts: Script[] = [];
  const scriptAssetPath = join(config.manifestPath, config.path);

  await Deno.mkdir(scriptAssetPath, { recursive: true });

  const _files = await bundle(
    config.entryPoints,
  );

  for (const [name, content] of _files) {
    _scripts.push([name, join(scriptAssetPath, name)]);
    await Deno.writeFile(
      join(scriptAssetPath, name),
      content,
    );
  }

  await Deno.writeTextFile(
    join(config.manifestPath, ".scripts.ts"),
    scripts(_scripts),
  );
}

function scripts(scripts: Script[]) {
  return `export default [${
    scripts.map(([name]) => `"${name}"`).join(", ")
  }];${EOL.LF}`;
}

async function bundle(entryPoints: EntryPoints) {
  const bundler = new Bundler(
    entryPoints,
    parse,
  );
  const files = await bundler.bundle();
  bundler.stop();
  return files;
}
