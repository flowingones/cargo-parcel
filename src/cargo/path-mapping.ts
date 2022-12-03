import { parse } from "./deps.ts";

interface PathMapping {
  path: string;
}

const pathMappings = new Map<string, PathMapping>([
  ["/index", { path: "" }],
  ["/_404", { path: "/*" }],
]);

/*
 *
 */
export function mappedPath(path: string): string {
  /*
   *
   */
  const parsedPath = parse(path);
  const mappedPath = pathMappings.get(`/${parsedPath.name}`);
  if (mappedPath) {
    return `${parsedPath.dir}${
      parsedPath.dir === "/"
        ? mappedPath.path.replace(/\//, "")
        : mappedPath.path
    }`;
  }

  /*
   * Prepare dynamic path segments for URLPattern
   * https://developer.mozilla.org/en-US/docs/Web/API/URLPattern
   */
  return path.replace(/(\[(.+?)\])/, ":$2");
}
