import { Get, name } from "../deps.ts";

import { render, tag, title } from "./deps.ts";
import { mappedPaths } from "./options.ts";

interface Page {
  path: string;
  title?: string;
  component: (props: JSX.ElementProps) => JSX.Element;
}

export async function StaticPage(
  pathToPage: string,
  root: (props: JSX.ElementProps) => JSX.Element,
) {
  const page = await initPage(pathToPage);

  return Get(`/${mappedPath(page.path)}`, () => {
    if (page.title) {
      title(page.title);
    }

    const response = new Response(
      `<!DOCTYPE html>${render(tag(root, {}, [tag(page.component, {}, [])]))}`,
      {
        headers: {
          "content-type": "text/html",
        },
      },
    );

    cleanup();

    return response;
  });
}

export function cleanup() {
  title("");
}

function mappedPath(path: string) {
  const mapped = mappedPaths.get(path);

  return mapped !== undefined ? mapped : path;
}

async function initPage(pathToFile: string): Promise<Page> {
  const page = await import(`file://${Deno.cwd()}/${pathToFile}`);
  return {
    title: page["title"],
    path: name(pathToFile),
    component: page[name(pathToFile)],
  };
}

/*
export async function ParcelPage(
  path: string,
  root: (props: JSX.ElementProps) => JSX.Element,
) {
  const routeName = name(path);

  Pages.add({
    path: routeName,
  });

  const runtime = (await bundle(
    dirname(import.meta.url) + "/../parcel/platform/browser/runtime.ts",
  ))[
    "deno:///bundle.js"
  ];

  const element = await import(`file://${Deno.cwd()}/${path}`);
  const app = (await bundle(path))["deno:///bundle.js"];

  setFramework(P);

  Get(`/runtime.js`, () => {
    return new Response(runtime, {
      headers: {
        "content-type": "application/javascript",
        //"Cache-Control": "max-age=3600",
      },
    });
  });

  Get(`/${routeName}.js`, () => {
    return new Response(app, {
      headers: {
        "content-type": "application/javascript",
        //"Cache-Control": "max-age=3600",
      },
    });
  });

  return Get(`/${routeName}`, () => {
    const script = {
      name: routeName,
      tags: [`/${routeName}.js`],
    };

    const r = P.tag(root, {
      script,
    }, [P.tag(element[routeName], null, [])]);

    return new Response(
      `<!DOCTYPE html>${render(r)}`,
      {
        headers: {
          "content-type": "text/html",
        },
      },
    );
  });
}
*/
