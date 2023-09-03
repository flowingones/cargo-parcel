import { type Task } from "cargo/mod.ts";
import { Get } from "cargo/http/mod.ts";
import { type Middleware } from "cargo/middleware/middleware.ts";
import { join } from "std/path/mod.ts";

import { mappedPath } from "../pages/path-mapping.ts";
import { type Plugin, plugins } from "../plugins/plugins.ts";
import { PageHandler } from "../pages/handler.ts";
import { BUILD_ID } from "../constants.ts";
import { isProd } from "cargo/utils/environment.ts";

export type PageRoute = {
  page: Renderable;
  layouts: Renderable[];
  middleware: { default: Middleware[] }[];
};

type Renderable = {
  default: PageLike;
};

export interface PageLikeProps<T = undefined> extends JSX.ElementProps {
  params: Record<string, string>;
  data: T;
}

// deno-lint-ignore no-explicit-any
export type PageLike = (props: PageLikeProps<any>) => JSX.Element;

export type ParcelTaskConfig = {
  plugins?: Plugin[];
  pagesPath?: string;
  islandsPath?: string;
  scriptsPath?: string;
  scriptsAssetsPath?: string;
  manifestPath?: string;
};

export const Parcel: (config: ParcelTaskConfig) => Promise<Task> =
  async function (
    config: ParcelTaskConfig,
  ) {
    const _manifestPath = config.manifestPath || ".manifest";

    /*
    /* Pages
     */
    const _pages: Record<string, PageRoute> = (await import(
      config.pagesPath || join(Deno.cwd(), _manifestPath, ".pages.ts")
    )).default;

    /*
     * Islands
     */
    const _islands: Record<string, JSX.Component> = (await import(
      config.islandsPath || join(Deno.cwd(), _manifestPath, ".islands.ts")
    )).default;

    /*
     * Scripts
     */
    const _scripts: string[] = (await import(
      config.scriptsPath || join(Deno.cwd(), _manifestPath, ".scripts.ts")
    )).default;

    for (const _script of _scripts) {
      const _file = await Deno.readFile(
        join(
          Deno.cwd(),
          _manifestPath,
          config.scriptsAssetsPath || ".scripts",
          _script,
        ),
      );
      Get(`/_parcel/${BUILD_ID}/${_script}`, () => {
        return new Response(_file, {
          headers: {
            "Content-Type": "application/javascript",
            ...(isProd()
              ? { "Cache-Control": "public, max-age=604800, immutable" }
              : {}),
          },
        });
      });
    }

    //TODO: Load and and register

    /*
     * Plugins
     */
    const { scripts, tasks } = await plugins(
      // TODO: Remove duplicate path defintion -> tasks/ParcelManfifest.ts
      { plugins: config.plugins, assetsPath: join("_parcel", BUILD_ID) },
    );

    return () => {
      for (const route in _pages) {
        const page: PageLike = _pages[route].page.default;
        const layouts: PageLike[] = _pages[route].layouts.map(
          (layout) => {
            return layout.default;
          },
        );

        const middleware = _pages[route].middleware.map(
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
            islands: _islands,
            middleware,
            scripts,
            tasks,
            statusCode: path.statusCode,
          }).handle(),
        );
      }
    };
  };
