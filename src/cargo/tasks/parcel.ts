import { isProd } from "cargo/utils/environment.ts";
import { Get, RequestContext } from "cargo/http/mod.ts";
import { parse } from "std/path/mod.ts";
import { Bundler, bundlerAssetRoute } from "../bundle.ts";
import { mappedPath, pageFrom } from "../mod.ts";
import { Plugin, plugins } from "../plugin.ts";

export interface Route {
  page: Page;
  layouts: Page[];
}

export interface Page {
  default: JSX.Component;
}

interface ParcelProps {
  pages: Record<string, Route>;
  islands?: Record<string, JSX.Component>;
  plugins?: Plugin[];
}

export async function Parcel(props: ParcelProps) {
  const entryPoints: Record<string, string> = {};

  /*
   * Islands
   */
  if (props.islands) {
    entryPoints["main"] =
      new URL("../../platform/browser/launch.ts", import.meta.url).href;

    for (const island in props.islands) {
      entryPoints[`island-${parse(island).name}`] = `./${island}`;
    }
  }

  /*
   * Plugins
   */
  const { scripts, entryPoints: pluginEntryPoints, tasks } = await plugins(
    props.plugins,
  );

  if (pluginEntryPoints) {
    for (const key in pluginEntryPoints) {
      entryPoints[key] = pluginEntryPoints[key];
    }
  }

  return () => {
    // Setup JS bundling for frontend
    if (Object.keys(entryPoints).length) {
      const bundler = new Bundler(entryPoints);

      Get(
        `${bundlerAssetRoute}/:fileName`,
        async ({ params }: RequestContext) => {
          const file = await bundler.resolve(params!.fileName);
          if (file instanceof Uint8Array) {
            return new Response(file, {
              headers: {
                "Content-Type": "application/javascript",
                ...(isProd()
                  ? { "Cache-Control": "public, max-age=604800, immutable" }
                  : {}),
              },
            });
          } else {
            return new Response(null, {
              status: 404,
            });
          }
        },
      );
    }

    for (const route in props.pages) {
      const page: JSX.Component = props.pages[route].page.default;
      const layouts: JSX.Component[] = props.pages[route].layouts.map(
        (layout) => {
          return layout.default;
        },
      );

      Get(
        mappedPath(route),
        (ctx: RequestContext) => {
          /*
           * Sync render context starts here
           */
          if (tasks?.beforeRender?.length) {
            for (const task of tasks.beforeRender) {
              task({ ...ctx });
            }
          }

          let renderedPage = pageFrom({
            page,
            layouts,
            islands: props.islands,
            scripts,
            params: ctx.params,
          });

          if (tasks?.afterRender?.length) {
            for (const task of tasks.afterRender) {
              renderedPage = task({ pageHtml: renderedPage, ...ctx });
            }
          }
          // Sync render context ends here

          return new Response(
            renderedPage,
            {
              headers: {
                "Content-Type": "text/html",
              },
            },
          );
        },
      );
    }
  };
}
