import { tag } from "./deps.ts";
import { assertEquals } from "../../test_deps.ts";

import { renderToString } from "./mod.ts";

function Title() {
  return <h1>Hello World!</h1>;
}

function Headline(props: JSX.ElementProps) {
  return <h1>{props.children}</h1>;
}

Deno.test(
  "Platform Server: Render to string",
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
    await t.step("SVG Element: <svg>", () => {
      assertEquals(
        renderToString(
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.85786 5.85787C2.10714 9.60859 -1.68606e-07 14.6957 0 20C1.68606e-07 25.3043 2.10714 30.3914 5.85786 34.1421C9.60859 37.8929 14.6957 40 20 40C25.3043 40 30.3914 37.8929 34.1421 34.1421L20 20L5.85786 5.85787Z"
              fill="#3A8E51"
            />
            <circle
              cx="20"
              cy="20"
              r="10.6667"
              fill="black"
              fill-opacity="0.5"
            />
          </svg>,
        ),
        `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.85786 5.85787C2.10714 9.60859 -1.68606e-07 14.6957 0 20C1.68606e-07 25.3043 2.10714 30.3914 5.85786 34.1421C9.60859 37.8929 14.6957 40 20 40C25.3043 40 30.3914 37.8929 34.1421 34.1421L20 20L5.85786 5.85787Z" fill="#3A8E51"></path><circle cx="20" cy="20" r="10.6667" fill="black" fill-opacity="0.5"></circle></svg>`,
      );
    });
  },
);
