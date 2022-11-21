import { bundle } from "../bundle.ts";
import { parse } from "../deps.ts";
import { mappedPath, page } from "../mod.ts";
import { Plugin, plugins } from "../plugin.ts";

export interface Page {
  default: JSX.Component;
}

interface ParcelProps {
  pages: Record<string, Page>;
  islands?: Record<string, JSX.Component>;
  plugins?: Plugin[];
}

/**
 * @deprecated
 * Use the function "Parcel" instead
 * Will be remove in version 1.x
 */
export const autoloadPages = Parcel;

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

      router.add({
        path: mappedPath(route),
        method: "GET",
        handler: async () => {
          let renderedPage = page({
            component,
            islands: props.islands,
            scripts,
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

/**
 * @deprecated
 * Use the task provided by Cargo Core for autoloading favicon
 * Will be remove in version 1.x
 */
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
