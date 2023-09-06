import { type Task } from "cargo/mod.ts";
import { Get } from "cargo/http/mod.ts";
import { type Middleware } from "cargo/middleware/middleware.ts";
import { join } from "std/path/mod.ts";
import { isProd } from "cargo/utils/environment.ts";

import { mappedPath } from "../pages/path-mapping.ts";
import { type Plugin, plugins } from "../plugins/plugins.ts";
import { PageHandler } from "../pages/handler.ts";
import { BUILD_ID } from "../constants.ts";

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
  pages?: Record<string, PageRoute>;
  islands?: Record<string, JSX.Component>;
  scripts?: string[];
  plugins?: Plugin[];
  pagesPath?: string;
  islandsPath?: string;
  scriptsPath?: string;
  scriptsAssetsPath?: string;
  manifestPath?: string;
};

export const Parcel: (config?: ParcelTaskConfig) => Promise<Task> =
  async function (
    config?: ParcelTaskConfig,
  ) {
    const _manifestPath = config?.manifestPath || join(Deno.cwd(), ".manifest");

    /*
    /* Pages
     */
    const _pages: Record<string, PageRoute> = config?.pages || (await import(
      config?.pagesPath ||
        new URL(`file://${join(_manifestPath, ".pages.ts")}`).href
    )).default;

    /*
     * Islands
     */
    const _islands: Record<string, JSX.Component> = config?.islands ||
      (await import(
        config?.islandsPath ||
          new URL(`file://${join(_manifestPath, ".islands.ts")}`).href
      )).default;

    /*
     * Scripts
     */
    const _scripts: string[] = config?.scripts || (await import(
      config?.scriptsPath ||
        new URL(`file://${join(_manifestPath, ".scripts.ts")}`).href
    )).default;

    for (const _script of _scripts) {
      const _file = await Deno.readFile(
        join(
          _manifestPath,
          config?.scriptsAssetsPath || ".scripts",
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
      { plugins: config?.plugins, assetsPath: join("_parcel", BUILD_ID) },
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
