import { bundle } from "../bundle.ts";
import { mappedPath, page } from "../mod.ts";

export interface Page {
  default: JSX.Node;
}

export interface Integration {
  getStyles(...args: any[]): string;
}

interface TaskConfig {
  cssIntegration?: Integration;
}

export function autoloadPages(
  pages: Record<string, Page>,
  islands?: Record<string, JSX.Node>,
  config?: TaskConfig,
) {
  return async (app: any) => {
    if (islands) {
      await bundle({
        pages,
        islands,
      });
    }

    for (const route in pages) {
      const currentPage: any = pages[route];

      app.getProtocol("http")?.router.add({
        path: mappedPath(route),
        method: "GET",
        handler: () => {
          return new Response(
            page({
              component: currentPage.default,
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
