import { render, tag, Twind } from "./deps.ts";
import { title } from "./mod.ts";

interface Page {
  path: string;
  title?: string;
  component: (props: JSX.ElementProps) => JSX.Element;
  twind?: boolean;
  status?: {
    code: number;
    text?: string;
  };
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
      status: page.status?.code,
      statusText: page.status?.text,
    },
  );

  cleanup();

  return response;
}

function cleanup() {
  title("");
  Twind.reset();
}
