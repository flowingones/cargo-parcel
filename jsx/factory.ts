import "./types.ts";

interface ElementAttributes {
  [attribute: string]: unknown;
}

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

export function factory(
  tag: unknown,
  attributes: ElementAttributes,
  ...childrens: Node[]
) {
  if (typeof tag === "string") {
    return renderElement(tag, attributes, childrens);
  }
  if (typeof tag === "function") {
    return tag(attributes, childrens);
  }
  return "";
}

function renderElement(
  tag: string,
  attributes: ElementAttributes,
  childrens: unknown[],
): string {
  if (selfClosingTags.includes(tag)) {
    return `<${tag}${handleAttributes(attributes)} />`;
  }
  return `<${tag}${handleAttributes(attributes)}>${
    childrens.join("")
  }</${tag}>`;
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
