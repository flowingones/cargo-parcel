import { Route } from "./mod.ts";
import { assertEquals, assertThrows } from "std/testing/asserts.ts";
import { setRequest } from "./route.ts";
Deno.test("Route", async (t) => {
  await t.step("should throw scope error (url)", () => {
    assertThrows(
      () => {
        Route.url();
      },
      Error,
      "Scope for the route could not be found",
    );
  });
  await t.step("should throw scope error (navigate)", () => {
    assertThrows(
      () => {
        Route.navigate("https://cargo.wtf/en");
      },
      Error,
      "Scope for the route could not be found",
    );
  });
  await t.step("should throw server side error (navigate)", () => {
    setRequest(new Request("https://cargo.wtf"));
    assertThrows(
      () => {
        Route.navigate("https://cargo.wtf/en");
      },
      Error,
      "Not allowed to navigate on the server side",
    );
    setRequest(undefined);
  });
  await t.step("should return href of request", () => {
    setRequest(new Request("https://cargo.wtf"));
    assertEquals(Route.url().href, "https://cargo.wtf/");
    setRequest(new Request("https://cargo.wtf/en"));
    assertEquals(Route.url().href, "https://cargo.wtf/en");
    setRequest(undefined);
  });
});
