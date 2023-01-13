import { assertEquals } from "std/testing/asserts.ts";
import { mappedPath } from "./path-mapping.ts";

Deno.test(mappedPath.name, async (t) => {
  await t.step('Should map "/index"', () => {
    assertEquals(mappedPath("/index"), "/");
    assertEquals(mappedPath("/dir/index"), "/dir");
    assertEquals(mappedPath("/dir/dir/index"), "/dir/dir");
  });
  await t.step('Should map "/_404"', () => {
    assertEquals(mappedPath("/_404"), "/*");
    assertEquals(mappedPath("/dir/_404"), "/dir/*");
    assertEquals(mappedPath("/dir/dir/_404"), "/dir/dir/*");
  });
  await t.step("should map static routes", () => {
    assertEquals(mappedPath("/file"), "/file");
    assertEquals(mappedPath("/dir/file"), "/dir/file");
    assertEquals(mappedPath("/dir/dir/file"), "/dir/dir/file");
  });
  await t.step("should map dynamic routes", () => {
    assertEquals(mappedPath("/[file]"), "/:file");
    assertEquals(mappedPath("/[dir]/[file]"), "/:dir/:file");
    assertEquals(mappedPath("/[dir]/[dir]/[file]"), "/:dir/:dir/:file");
  });
});
