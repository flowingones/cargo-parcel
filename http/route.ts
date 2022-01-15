import { Get } from "../deps.ts";
import { render } from "../server/render.ts";
export function ParcelPage(path: string, element: JSX.Element) {
  /*
   * Build and register route to frontend bundle
   */
  Get("/{bundlen-name}-{hash}.js", () => {
    return new Response("console.log('Hello')", {
      headers: {
        "content-type": "application/javascript",
      },
    });
  });

  Get(path, () => {
    const { tag, children, ...props } = element;
    return new Response(`<!DOCTYPE html>${render(tag, props, children)}`, {
      headers: {
        "content-type": "text/html",
      },
    });
  });
}
