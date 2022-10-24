import { bundle } from "../bundle.ts";
import { parse } from "../deps.ts";
import { mappedPath, page } from "../mod.ts";

export interface Page {
  default: JSX.Component;
}

export interface Plugin {
  name: string;
  entryPoints: Record<string, string>[];
  plugin(): {
    scripts: string[];
  };
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

export function Parcel(props: ParcelProps) {
  const scripts: string[] = [];

  props.plugins?.forEach((plugin) => scripts.push(...plugin.plugin().scripts));

  return async (app: any) => {
    const router: any = app.getProtocol("http")?.router;

    // Register bundle routes
    if (props.islands && Object.keys(props.islands).length) {
      (await bundle({
        islands: props.islands,
        plugins: props.plugins,
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
        handler: () => {
          return new Response(
            page({
              component,
              islands: props.islands,
              scripts,
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
