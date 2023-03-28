import { isProd } from "cargo/utils/environment.ts";
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

interface BundleHandlerProps {
  params: {
    fileName: string;
  };
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

  return (app: any) => {
    const router: any = app.getProtocol("http")?.router;

    // Setup JS bundling for frontend
    if (Object.keys(entryPoints).length) {
      const bundler = new Bundler(entryPoints);

      router.add({
        path: `${bundlerAssetRoute}/:fileName`,
        method: "GET",
        handler: async ({ params }: BundleHandlerProps) => {
          const file = await bundler.resolve(params.fileName);
          if (file instanceof Uint8Array) {
            return new Response(file, {
              headers: {
                "Content-Type": "application/javascript",
                ...(isProd() ? { "Cache-Control": "max-age=3600" } : {}),
              },
            });
          } else {
            return new Response(null, {
              status: 404,
            });
          }
        },
      });
    }

    for (const route in props.pages) {
      const page: JSX.Component = props.pages[route].page.default;
      const layouts: JSX.Component[] = props.pages[route].layouts.map(
        (layout) => {
          return layout.default;
        },
      );

      router.add({
        path: mappedPath(route),
        method: "GET",
        handler: async (ctx: any) => {
          let renderedPage = pageFrom({
            page,
            layouts,
            islands: props.islands,
            scripts,
            params: ctx.params,
          });

          if (tasks?.afterRender?.length) {
            for (const task of tasks.afterRender) {
              renderedPage = await task({ pageHtml: renderedPage });
            }
          }

          return new Response(
            renderedPage,
            {
              headers: {
                "Content-Type": "text/html",
              },
            },
          );
        },
      });
    }
  };
}
