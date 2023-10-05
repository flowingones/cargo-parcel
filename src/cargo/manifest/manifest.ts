export async function createManifestDirectory() {
  try {
    await Deno.remove(".manifest", { recursive: true });
    await Deno.mkdir(".manifest");
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      await Deno.mkdir(".manifest");
      return;
    }
    throw e;
  }
}
