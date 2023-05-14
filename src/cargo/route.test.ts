import { Route } from "./mod.ts";
import { assertEquals, assertThrows } from "std/testing/asserts.ts";
import { setContext } from "./context.ts";
Deno.test("Route", async (t) => {
  await t.step("should throw scope error (url)", () => {
    assertThrows(
      () => {
        Route.url();
      },
      Error,
      "Request Context not set!",
    );
  });
  await t.step("should throw scope error (navigate)", () => {
    assertThrows(
      () => {
        Route.navigate("https://cargo.wtf/en");
      },
      Error,
      "Request Context not set!",
    );
  });
  await t.step("should throw server side error (navigate)", () => {
    setContext({ request: new Request("https://cargo.wtf") } as any);
    assertThrows(
      () => {
        Route.navigate("https://cargo.wtf/en");
      },
      Error,
      "Not allowed to navigate on the server side",
    );
    setContext(undefined);
  });
  await t.step("should return href of request", () => {
    setContext({ request: new Request("https://cargo.wtf") } as any);
    assertEquals(Route.url().href, "https://cargo.wtf/");
    setContext({ request: new Request("https://cargo.wtf/en") } as any);
    assertEquals(Route.url().href, "https://cargo.wtf/en");
    setContext(undefined);
  });
});
