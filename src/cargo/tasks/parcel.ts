import { bundle } from "../bundle.ts";
import { BUILD_ID, isProd } from "../constants.ts";
import { parse } from "../deps.ts";
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

  return async (app: any) => {
    const router: any = app.getProtocol("http")?.router;

    // Register bundle routes
    if (Object.keys(entryPoints).length) {
      (await bundle({
        entryPoints: entryPoints,
      }))?.forEach((file) => {
        router.add({
          path: `/_parcel/${BUILD_ID}/${
            parse(file.path).name.replaceAll("$", "")
          }.js`,
          method: "GET",
          handler: () => {
            return new Response(file.contents, {
              headers: {
                "content-type": "application/javascript",
                ...(isProd ? { "cache-control": "max-age=3600" } : {}),
              },
            });
          },
        });
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
                "content-type": "text/html",
              },
            },
          );
        },
      });
    }
  };
}
