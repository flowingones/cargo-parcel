import { isProd } from "cargo/utils/environment.ts";
import { Get, RequestContext } from "cargo/http/mod.ts";
import { parse } from "std/path/mod.ts";
import { Bundler, bundlerAssetRoute } from "../bundle.ts";
import { mappedPath } from "../mod.ts";
import { Plugin, plugins } from "../plugin.ts";
import { PageHandler } from "../handler.ts";
import { type Middleware } from "cargo/middleware/middleware.ts";

export interface PageRoute {
  page: Renderable;
  layouts: Renderable[];
  middleware: { default: Middleware[] }[];
}

export interface Renderable {
  default: JSX.Component;
}

interface ParcelProps {
  pages: Record<string, PageRoute>;
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
          const file = await bundler.resolve(params!.fileName!);
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

      const middleware = props.pages[route].middleware.map(
        (module) => {
          return module.default;
        },
      ).flat();

      const path = mappedPath(route);

      Get(
        path.path,
        new PageHandler({
          page,
          layouts,
          islands: props.islands,
          middleware,
          scripts,
          tasks,
          statusCode: path.statusCode,
        }).handle(),
      );
    }
  };
}
