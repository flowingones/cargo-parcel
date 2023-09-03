import { EntryPoints } from "../bundler/bundler.ts";
import { ParcelTaskConfig } from "../tasks/parcel.ts";
import { plugins } from "./plugins.ts";

type PluginsManifestConfig = {
  path: string;
  assetsPath: string;
};

export async function pluginsManifest(
  config: PluginsManifestConfig,
): Promise<EntryPoints> {
  const _parcelConfig: ParcelTaskConfig = await import(config.path);
  const _plugins = _parcelConfig.plugins;

  return (await plugins({
    plugins: _plugins,
    assetsPath: config.assetsPath,
  })).entryPoints || {};
}
