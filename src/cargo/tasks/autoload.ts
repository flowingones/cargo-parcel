import { mappedPath } from "../mod.ts";

// TODO: Import from mod.ts
import { page } from "../page.ts";

export interface Integration {
  getStyles(...args: any[]): string;
}

interface TaskConfig {
  cssIntegration?: Integration;
}

export function autoloadPages(
  routes: Record<string, unknown>,
  config: TaskConfig,
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
              cssIntegration: config?.cssIntegration,
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
