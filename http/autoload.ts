import { extension, log, name } from "../deps.ts";
import { Page } from "./route.ts";

export async function autoloadPages(
  basePath: string,
  path?: string,
  context?: string,
): Promise<void> {
  const pathToResolve = path ? `${basePath}/${path}` : basePath;

  try {
    for await (const file of Deno.readDir(basePath)) {
      if (file.isDirectory || file.isSymlink) {
        autoloadPages(basePath, path ? `${path}/${file.name}` : file.name);
      } else if (extension(file) === "tsx") {
        Page(name(file), `${pathToResolve}/${file}`);
      }
    }
  } catch (_err: unknown) {
    log(
      context || "PARCEL PAGELOADER",
      "No routes from the 'assets' directory loaded!",
    );
  }
}
