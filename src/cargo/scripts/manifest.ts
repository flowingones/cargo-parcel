import { join, parse } from "std/path/mod.ts";
import { Bundler, type EntryPoints } from "../bundler/bundler.ts";
import { EOL } from "https://deno.land/std@0.173.0/fs/mod.ts";

type Script = [string, string];

type ScriptManifestConfig = {
  manifestPath: string;
  manifestFileName: string;
  manifestAssetspath: string;
  entryPoints: EntryPoints;
  isProd?: boolean;
};

export async function scriptsManifest(
  config: ScriptManifestConfig,
) {
  const _scripts: Script[] = [];
  const scriptManifestAssetPath = join(
    config.manifestPath,
    config.manifestAssetspath,
  );
  const scriptManifestPath = join(config.manifestPath, config.manifestFileName);

  await Deno.mkdir(scriptManifestAssetPath, { recursive: true });

  const _files = await bundle(
    config.entryPoints,
  );

  for (const [name, content] of _files) {
    _scripts.push([name, join(scriptManifestAssetPath, name)]);
    await Deno.writeFile(
      join(scriptManifestAssetPath, name),
      content,
    );
  }

  await writeManifest(_scripts, scriptManifestPath);
}

function scripts(scripts: Script[]) {
  return `export default [${
    scripts.map(([name]) => `"${name}"`).join(", ")
  }];${EOL.LF}`;
}

async function writeManifest(manifest: Script[], path: string) {
  const _content = scripts(manifest);

  try {
    const existingManifest = await Deno.readTextFile(
      path,
    );

    if (existingManifest !== _content) {
      return await Deno.writeTextFile(
        path,
        _content,
      );
    }
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      return await Deno.writeTextFile(
        path,
        _content,
      );
    }
    throw e;
  }
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
