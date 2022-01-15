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
  children?: string[] | JSX.Element[],
): string {
  if (selfClosingTags.includes(tag)) {
    return `<${tag}${props ? handleAttributes(props) : ""} />`;
  }
  return `<${tag}${props ? handleAttributes(props) : ""}>${
    children?.length ? renderChildren(children) : ""
  }</${tag}>`;
}

function renderChildren(children: string[] | JSX.Element[]) {
  for (const child of children) {
    if (typeof child === "string") {
      console.log(child);
    } else {
      const { tag, children, ...props } = child;
      return render(tag, props, children);
    }
    console.log(child);
  }
}

function handleAttributes(attributes: ElementAttributes) {
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
