import { AST, VComponent, VElement, VNode, VText } from "./deps.ts";
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
  // VNode is null or undefined
  if (!vNode) return "";

  // VNode is VText
  if (
    vNode.type === "text"
  ) {
    return escapeHtml((<VText<T>> vNode).text.toString());
  }

  // VNode is VElement
  if (vNode.type === "element") {
    return elementToString(<VElement<T>> vNode);
  }

  //VNode is VComponent
  if (vNode.type === "component") {
    return stringify(<VComponent<T>> vNode.ast);
  }

  throw Error("Node type is not supported!");
}

function elementToString<T>(vNode: VElement<T>): string {
  if (selfClosingTags.includes(vNode.tag)) {
    return `<${vNode.tag}${stringFrom(vNode.props)}/>`;
  }

  const { props, children } = vNode;
  return `<${vNode.tag}${stringFrom(props)}>${
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
    if (typeof attribute === "boolean") {
      attributesString += ` ${key}`;
    }
  }
  return attributesString;
}
