import "../parcel/jsx/types.ts";
import { extension, log } from "../deps.ts";
import { StaticPage } from "./route.ts";

export async function autoloadPages(
  basePath: string,
  root: (props: JSX.ElementProps) => JSX.Element,
  path?: string,
  context?: string,
): Promise<void> {
  const pathToResolve = path ? `${basePath}/${path}` : basePath;
  try {
    for await (const file of Deno.readDir(basePath)) {
      if (file.isDirectory || file.isSymlink) {
        autoloadPages(
          basePath,
          root,
          path ? `${path}/${file.name}` : file.name,
        );
      } else if (extension(file.name) === "tsx") {
        StaticPage(`${pathToResolve}/${file.name}`, root);
      }
    }
  } catch (_err: unknown) {
    console.log(_err);
    log(
      context || "PARCEL PAGELOADER",
      `No routes from the directory '${basePath}' loaded!`,
    );
  }
}
