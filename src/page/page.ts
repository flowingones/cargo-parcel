import { getStyleTag, render, sheet, tag } from "./deps.ts";
import { title } from "./mod.ts";

interface Page {
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
  setTitle(page.title);

  const response = new Response(
    `<!DOCTYPE html>${render(tag(root, { ...twind(page) }))}`,
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

function setTitle(pageTitle?: string) {
  if (pageTitle) {
    title(pageTitle);
  }
}

function resetTitle() {
  title("");
}

function twind(page: Page) {
  /* @ts-ignore */
  sheet.reset();

  return {
    content: render(tag(page.component, {}, [])),
    twindStyles: page.twind ? getStyleTag(sheet) : undefined,
  };
}

function cleanup() {
  resetTitle();
  /* @ts-ignore */
  sheet.reset();
}
