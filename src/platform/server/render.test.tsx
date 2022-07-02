import { tag } from "../../mod.ts";
import { assertEquals } from "../../test_deps.ts";

import { renderToString } from "./mod.ts";

function Title() {
  return <h1>Hello World!</h1>;
}

function Headline(props: JSX.ElementProps) {
  return <h1>{props.children}</h1>;
}

Deno.test(
  "Render to string",
  async (t) => {
    await t.step("Component with children: <Headline>Hello<Headline/>", () => {
      assertEquals(
        renderToString(<Headline>Hello</Headline>),
        "<h1>Hello</h1>",
      );
    });

    await t.step("Component without children: <Title/>", () => {
      assertEquals(
        renderToString(<Title />),
        "<h1>Hello World!</h1>",
      );
    });

    await t.step("HTML Tag: <div>Hello</div>", () => {
      assertEquals(
        renderToString(<div class="bg-red">Hello</div>),
        '<div class="bg-red">Hello</div>',
      );
    });

    await t.step("HTML Single Tag: <img/>", () => {
      assertEquals(
        renderToString(
          <img
            href="https://cargo.wtf"
            alt="A very interesting description :-)"
          />,
        ),
        '<img href="https://cargo.wtf" alt="A very interesting description :-)"/>',
      );
    });
  },
);
