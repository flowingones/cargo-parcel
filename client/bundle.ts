/// <reference lib="deno.unstable" />

export async function bundle(path: string): Promise<string> {
  return (await Deno.emit(path, {
    bundle: "module",
    compilerOptions: {
      "jsx": "react",
      "jsxFactory": "factory",
    },
  })).files["deno:///bundle.js"];
}
