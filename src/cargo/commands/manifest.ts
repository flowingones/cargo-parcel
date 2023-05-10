export async function createManifestDirectory() {
  try {
    await Deno.stat(".manifest");
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      await Deno.mkdir(".manifest");
      return;
    }
    throw e;
  }
}
