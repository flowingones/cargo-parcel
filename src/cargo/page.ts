import { bodyAttributes } from "./body.ts";
import { parse, VNode, vNodeToString } from "./deps.ts";
import { Footer, footer, getFooter } from "./footer.ts";
import { getHead, Head, head } from "./head.ts";
import { htmlAttributes } from "./html.ts";
import { type Island } from "./islands.ts";

export const cleanup: Array<() => void> = [];

export interface Integration {
  getStyles(...args: any[]): string;
}

interface PageProps {
  vNode: VNode<unknown>;
  cssIntegration?: Integration;
  islands?: Island[];
}

export function page(props: PageProps) {
  if (props.islands?.length) {
    footer({
      script: [`<script type="module">import { launch } from "/main.js";
${
        props.islands.map((island) =>
          `import ${
            parse(island.path).name.replaceAll("-", "")
          } from "/island-${parse(island.path).name}.js";\n`
        ).join("")
      }
launch([${
        props.islands.map((island) => {
          return `{ id: "${island.id}", node: ${
            parse(island.path).name.replaceAll("-", "")
          }}`;
        }).join()
      }]);</script>`],
    });
  }

  if (props.cssIntegration) {
    head({ link: [props.cssIntegration?.getStyles()] });
  }

  return html({
    body: vNodeToString(props.vNode),
    head: getHead(),
    htmlAttributes: htmlAttributes(),
    bodyAttributes: bodyAttributes(),
    footer: getFooter(),
  });
}

interface HtmlProps {
  body: string;
  head?: Head;
  htmlAttributes?: string[];
  bodyAttributes?: string[];
  footer?: Footer;
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
  }</head><body ${props.bodyAttributes?.join(" ") || ""}>${props.body}${
    props.footer?.script?.join("") || ""
  }${props.footer?.noscript?.join("") || ""}</body></html>`;
}
