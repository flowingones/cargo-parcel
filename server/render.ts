import { ElementAttributes } from "../jsx/factory.ts";

const selfClosingTags = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
];

export function render(
  tag: string,
  props?: ElementAttributes,
  children?: JSX.Node[],
): string {
  if (selfClosingTags.includes(tag)) {
    return `<${tag}${props ? stringifyAttributes(props) : ""} />`;
  }
  return `<${tag}${props ? stringifyAttributes(props) : ""}>${
    children?.length ? renderChildren(children) : ""
  }</${tag}>`;
}

function renderChildren(children: JSX.Node[]): string {
  let str = "";
  for (const child of children) {
    if (typeof child === "string") {
      str += child;
    }
    if ((<JSX.Element> child)?.tag) {
      const { tag, children, ...props } = <JSX.Element> child;
      str += render(tag, props, children);
    }
  }
  return str;
}

function stringifyAttributes(attributes: ElementAttributes): string {
  let attributesString = "";
  for (const key in attributes) {
    const attribute = attributes[key];
    if (typeof attribute === "string") {
      attributesString += ` ${key}="${attribute}"`;
    }
    if (typeof attribute === "boolean") {
      attributesString += ` ${key}`;
    }
  }
  return attributesString;
}
