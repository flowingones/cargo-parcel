import { assertEquals } from "std/assert/mod.ts";
import { mappedPath } from "./path-mapping.ts";

Deno.test(mappedPath.name, async (t) => {
  await t.step('Should map "/!404"', () => {
    assertEquals(mappedPath("!404").path, "/*");
    assertEquals(mappedPath("/dir/!404").path, "/dir/*");
    assertEquals(mappedPath("/dir/dir/!404").path, "/dir/dir/*");
  });
  await t.step("should map static routes", () => {
    assertEquals(mappedPath("/file").path, "/file");
    assertEquals(mappedPath("/dir/file").path, "/dir/file");
    assertEquals(mappedPath("/dir/dir/file").path, "/dir/dir/file");
  });
  await t.step("should map dynamic routes", () => {
    assertEquals(mappedPath("/[file]").path, "/:file");
    assertEquals(mappedPath("/[dir]/[file]").path, "/:dir/:file");
    assertEquals(mappedPath("/[dir]/[dir]/[file]").path, "/:dir/:dir/:file");
    assertEquals(mappedPath("/[file]/!404").path, "/:file/*");
  });
});
