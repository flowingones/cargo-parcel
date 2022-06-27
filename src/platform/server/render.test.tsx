import { tag } from "../../mod.ts";
import { assertEquals } from "../../test_deps.ts";

import { render } from "./mod.ts";

Deno.test(
  "Render to string",
  async (t) => {
    await t.step("<div></div>", () => {
      assertEquals(
        render(<div class="bg-red">Hello</div>),
        '<div class="bg-red">Hello</div>',
      );
    });

    await t.step("<img/>", () => {
      assertEquals(
        render(
          <img
            href="https://cargo.wtf"
            alt="A very interesting description :-)"
          />,
        ),
        '<img href="https://cargo.wtf" alt="A very interesting description :-)"/>',
      );
    });

    /*
    await t.step("<svg>", () => {
      function SVG() {
        return (
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" fill="white" />
            <circle cx="16" cy="16" r="14" fill="#D9D9D9" />
            <path
              d="M7 21C7 21 9.5 26 16 26C22.5 26 25 21 25 21"
              stroke="black"
              stroke-width="2"
            />
            <circle
              cx="10"
              cy="11"
              r="2"
              fill="#D9D9D9"
              stroke="black"
              stroke-width="2"
            />
            <circle
              cx="22"
              cy="11"
              r="2"
              fill="#D9D9D9"
              stroke="black"
              stroke-width="2"
            />
            <line
              x1="16"
              y1="14"
              x2="16"
              y2="20"
              stroke="black"
              stroke-width="2"
            />
          </svg>
        );
      }

      assertEquals(
        render(
          <SVG />,
        ),
        `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="white"/><circle cx="16" cy="16" r="14" fill="#D9D9D9"/><path d="M7 21C7 21 9.5 26 16 26C22.5 26 25 21 25 21" stroke="black" stroke-width="2"/><circle cx="10" cy="11" r="2" fill="#D9D9D9" stroke="black" stroke-width="2"/><circle cx="22" cy="11" r="2" fill="#D9D9D9" stroke="black" stroke-width="2"/><line x1="16" y1="14" x2="16" y2="20" stroke="black" stroke-width="2"/></svg>`,
      );
    });
    */
  },
);
