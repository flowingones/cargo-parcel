import "../jsx/types.ts";

import { dirname, Get, name } from "../deps.ts";
import { render } from "../server/render.ts";
import { bundle } from "../browser/bundle.ts";
import { Pages } from "../page/pages.ts";

export async function ParcelPage(
  path: string,
  root: JSX.Component,
) {
  const routeName = name(path);

  Pages.add({
    path: routeName,
  });

  const element = await import(`file://${Deno.cwd()}/${path}`);
  const app = (await bundle(path))["deno:///bundle.js"];
  const runtime = (await bundle(
    dirname(import.meta.url) + "/../browser/runtime.ts",
  ))[
    "deno:///bundle.js"
  ];

  const script = {
    name: routeName,
    tags: [`/${routeName}.js`],
  };

  const { tag, children, ...props } = root({
    children: [element[routeName]()],
    scripts: ["/runtime.js", ...script.tags],
  });

  Get(`/${routeName}.js`, () => {
    return new Response(app, {
      headers: {
        "content-type": "application/javascript",
        "Cache-Control": "max-age=3600",
      },
    });
  });

  Get(`/runtime.js`, () => {
    return new Response(runtime, {
      headers: {
        "content-type": "application/javascript",
        "Cache-Control": "max-age=3600",
      },
    });
  });

  Get(`/${routeName}`, () => {
    return new Response(`<!DOCTYPE html>${render(tag, props, children)}`, {
      headers: {
        "content-type": "text/html",
      },
    });
  });
}

export function StaticPage(
  path: string,
  element: JSX.Element,
) {
  Get(path, () => {
    const { tag, children, ...props } = element;
    return new Response(`<!DOCTYPE html>${render(tag, props, children)}`, {
      headers: {
        "content-type": "text/html",
      },
    });
  });
}

export const Page = StaticPage;
