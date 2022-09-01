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

export function autoloadFavicon(path: string) {
  return (app: any) => {
    app.getProtocol("http")?.router.add({
      path: "/favicon.ico",
      method: "GET",
      handler: async () => {
        try {
          const file = await Deno.open(path);
          return new Response(
            file.readable,
            {
              headers: {
                "content-type": "image/vnd.microsoft.icon",
              },
            },
          );
        } catch (e) {
          if (e instanceof Deno.errors.NotFound) {
            throw new Error("Not able to load favicon");
          }
          throw e;
        }
      },
    });
  };
}
