import { AST, VComponent, VElement, VNode, VText, VType } from "./deps.ts";
import "../../types.ts";

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

export function vNodeToString(vNode: VNode<unknown>) {
  return stringify(vNode);
}

export function renderToString(
  node: JSX.Node,
): string {
  const tree = AST.create<unknown>(node);
  return stringify(tree);
}

function stringify<T>(vNode: VNode<T>): string {
  if (!vNode) return "";

  switch (vNode.type) {
    case VType.TEXT:
      return escapeHtml((<VText<T>> vNode).text.toString());
    case VType.ELEMENT:
      return elementToString(<VElement<T>> vNode);
    case VType.COMPONENT:
      return stringify(<VComponent<T>> vNode.ast);
    default:
      throw Error("Node type is not supported!");
  }
}

function elementToString<T>(vNode: VElement<T>): string {
  if (selfClosingTags.includes(vNode.tag)) {
    return `<${vNode.tag}${stringFrom(vNode.props)}/>`;
  }

  const { props, children } = vNode;
  const { unsafeInnerHTML, ...attributes } = props;
  if (unsafeInnerHTML) {
    return `<${vNode.tag}${
      stringFrom(attributes)
    }>${unsafeInnerHTML}</${vNode.tag}>`;
  }
  return `<${vNode.tag}${stringFrom(attributes)}>${
    children?.map((child) => stringify(child)).join("")
  }</${vNode.tag}>`;
}

function stringFrom(attributes: JSX.IntrinsicElements): string {
  let attributesString = "";
  for (const key in attributes) {
    const attribute = attributes[key];
    if (typeof attribute === "string") {
      attributesString += ` ${key}="${escapeHtml(attribute)}"`;
    }
    if (attribute === true) {
      attributesString += ` ${key}`;
    }
  }
  return attributesString;
}
