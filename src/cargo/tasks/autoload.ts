import { mappedPath } from "../mod.ts";

// TODO: Import from mod.ts
import { page } from "../page.ts";

export function autoloadPages(
  routes: Record<string, unknown>,
) {
  return (app: any) => {
    for (const route in routes) {
      const component: any = routes[route];

      app.getProtocol("http")?.router.add({
        path: mappedPath(route),
        method: "GET",
        handler: () => {
          return new Response(
            page({
              component: component.default,
            }),
            {
              headers: {
                "content-type": "text/html",
              },
            },
          );
        },
      });
    }
  };
}
