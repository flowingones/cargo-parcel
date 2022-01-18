import { Get } from "../deps.ts";
import { render } from "../server/render.ts";

export function Page(
  path: string,
  element: JSX.Element,
  options = { static: true },
) {
  if (!options.static) {
    Get("/parcel-bundle}-{hash}.js", () => {
      return new Response("console.log('Hello')", {
        headers: {
          "content-type": "application/javascript",
          "Cache-Control": "max-age=3600",
        },
      });
    });
  }

  Get(path, () => {
    const { tag, children, ...props } = element;
    return new Response(`<!DOCTYPE html>${render(tag, props, children)}`, {
      headers: {
        "content-type": "text/html",
      },
    });
  });
}

/*
 * @deprecated Will be removed in version 0.1.15
 */
export const ParcelPage = Page;
