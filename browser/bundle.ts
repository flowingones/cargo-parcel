/// <reference lib="deno.unstable" />

export async function bundle(path: string): Promise<Record<string, string>> {
  return (await Deno.emit(path, {
    bundle: "module",
    compilerOptions: {
      "jsx": "react",
      "jsxFactory": "factory",
    },
  })).files;
}

export async function save(data: string, path: string): Promise<void> {
  await Deno.writeTextFile(path, data);
}
