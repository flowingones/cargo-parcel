import { bundle } from "../bundle.ts";
import { AST, parse, tag, VComponent } from "../deps.ts";
import {
  findIslands,
  type Integration,
  Island,
  mappedPath,
  page,
} from "../mod.ts";

export interface Page {
  default: JSX.Node;
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
      const currentPage: any = props.pages[route];
      let islands: Island[];

      const vNode = <VComponent<unknown>> AST.create(
        tag(currentPage.default, null, []),
      );

      if (props.islands) {
        islands = findIslands(vNode, props.islands);
      }

      app.getProtocol("http")?.router.add({
        path: mappedPath(route),
        method: "GET",
        handler: () => {
          return new Response(
            page({
              vNode,
              cssIntegration: props.config?.cssIntegration,
              islands,
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
