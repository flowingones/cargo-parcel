import { render, tag, Twind } from "./deps.ts";
import { title } from "./mod.ts";

interface Page {
  path: string;
  title?: string;
  component: (props: JSX.ElementProps) => JSX.Element;
  twind?: boolean;
}

export function page(
  page: Page,
  root: (props: JSX.ElementProps) => JSX.Element,
) {
  if (page.title) {
    title(page.title);
  }

  let twind = "";
  Twind.reset();

  const content = render(tag(page.component, {}, []));

  if (page.twind) {
    twind = Twind.styleTag(Twind.sheet());
  }

  const response = new Response(
    `<!DOCTYPE html>${render(tag(root, { twind, content }))}`,
    {
      headers: {
        "content-type": "text/html",
      },
    },
  );

  cleanup();

  return response;
}

function cleanup() {
  title("");
  Twind.reset();
}
