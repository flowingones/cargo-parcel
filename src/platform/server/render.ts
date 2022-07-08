import "../../types.ts";

import { componentsCache } from "./deps.ts";
import { escapeHtml } from "./utils.ts";

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
  node: JSX.Element,
) {
  return parse(node);
}

function parse(node: JSX.Node): string {
  if (!node) return "";

  if (typeof node === "string" || typeof node === "number") {
    return escapeHtml(node.toString());
  }

  if (typeof (<JSX.Element> node).tag === "string") {
    return elementToString(node);
  }

  if (typeof node.tag === "function") {
    return componentToString(node);
  }

  return "";
}

function elementToString(node: JSX.Element): string {
  if (selfClosingTags.includes(<string> node.tag)) {
    return `<${(<JSX.Element> node).tag}${stringFrom(node.props)}/>`;
  }

  return `<${(<JSX.Element> node).tag}${stringFrom(node.props)}>${
    node.children?.map((child) => parse(child)).join("")
  }</${(<JSX.Element> node).tag}>`;
}

function componentToString(node: JSX.Element): string {
  if (typeof node.tag === "function") {
    const props: JSX.ElementProps = node.props;
    props.children = node.children;

    componentsCache.toCreate.push({
      id: Symbol(),
      fn: node.tag,
      props,
      hooks: {},
      state: [],
    });

    const str = parse(node.tag(props));
    componentsCache.toCreate.pop();

    return str;
  }
  throw Error('Component tag must be typeof "function"');
}

function stringFrom(attributes: JSX.IntrinsicElements): string {
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
