import { bodyAttributes } from "./body.ts";
import { AST, astToString, tag } from "./deps.ts";
import { getHead, Head } from "./head.ts";
import { htmlAttributes } from "./html.ts";

export const cleanup: Array<() => void> = [];

interface PageProps {
  component: JSX.Component;
}

export function page(props: PageProps) {
  // TODO: Pass in page props
  const tree = AST.create(tag(props.component, null, []));
  const component = astToString(tree);

  const content = html({
    content: component,
    head: getHead(),
    htmlAttributes: htmlAttributes(),
    bodyAttributes: bodyAttributes(),
  });
  return content;
}

interface HtmlProps {
  content: string;
  head?: Head;
  htmlAttributes?: string[];
  bodyAttributes?: string[];
}

function html(props: HtmlProps) {
  return `<!DOCTYPE html><html ${props.htmlAttributes?.join(" ")}><head>${
    props.head?.base || ""
  }<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${
    props.head?.meta?.join("") || ""
  }${props.head?.link?.join("") || ""}${props.head?.style?.join("") || ""}${
    props.head?.script?.join("") || ""
  }${props.head?.noscript?.join("") || ""}${
    props.head?.title || ""
  }</head><body ${
    props.bodyAttributes?.join(" ") || ""
  }>${props.content}</body></html>`;
}
