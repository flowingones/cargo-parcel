import { assertEquals } from "https://deno.land/std@0.144.0/testing/asserts.ts";
import { mappedPath } from "./path-mapping.ts";

Deno.test("Handle path mapping", async (t) => {
  await t.step("Map: /index", () => {
    assertEquals(mappedPath("/index"), "/");
    assertEquals(mappedPath("/dir/index"), "/dir");
    assertEquals(mappedPath("/dir/dir/index"), "/dir/dir");
  });
  await t.step("Map: /_404", () => {
    assertEquals(mappedPath("/_404"), "/*");
    assertEquals(mappedPath("/dir/_404"), "/dir/*");
    assertEquals(mappedPath("/dir/dir/_404"), "/dir/dir/*");
  });
  await t.step("Map: Others", () => {
    assertEquals(mappedPath("/file"), "/file");
    assertEquals(mappedPath("/dir/file"), "/dir/file");
    assertEquals(mappedPath("/dir/dir/file"), "/dir/dir/file");
  });
});
