import { bundle } from "../bundle.ts";
import { parse } from "../deps.ts";
import { type Integration, mappedPath, page } from "../mod.ts";

export interface Page {
  default: JSX.Component;
}

interface TaskConfig {
  cssIntegration?: Integration;
}

interface AutoloadPagesProps {
  pages: Record<string, Page>;
  islands?: Record<string, JSX.Component>;
  config?: TaskConfig;
}

export function autoloadPages(props: AutoloadPagesProps) {
  return async (app: any) => {
    // Register bundle routes
    if (props.islands && Object.keys(props.islands).length) {
      (await bundle({
        islands: props.islands,
      }))?.forEach((file) => {
        app.getProtocol("http")?.router.add({
          path: `/${parse(file.path).name.replaceAll("$", "")}.js`,
          method: "GET",
          handler: () => {
            return new Response(file.contents, {
              headers: {
                "content-type": "application/javascript",
              },
            });
          },
        });
      });
    }

    for (const route in props.pages) {
      const component: JSX.Component = props.pages[route].default;

      app.getProtocol("http")?.router.add({
        path: mappedPath(route),
        method: "GET",
        handler: () => {
          return new Response(
            page({
              component,
              cssIntegration: props.config?.cssIntegration,
              islands: props.islands,
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
