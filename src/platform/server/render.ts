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

export function renderToString(
  node: JSX.Node,
): string {
  const tree = AST.create(node);
  return stringify(tree);
}

export function stringify(vNode: VNode) {
  // VNode is null or undefined
  if (!vNode) return "";

  // VNode is VText
  if (
    typeof (<VText> vNode).text === "string" ||
    typeof (<VText> vNode).text === "number"
  ) {
    return escapeHtml((<VText> vNode).text.toString());
  }

  // VNode is VElement
  if (typeof (<VElement> vNode).tag === "string") {
    return elementToString(<VElement> vNode);
  }

  //VNode is VComponent
  if (typeof (<VComponent> vNode).fn === "function") {
    return componentToString(<VComponent> vNode);
  }

  throw Error("This type of ast node is not supported!");
}

function elementToString(vNode: VElement): string {
  if (selfClosingTags.includes(vNode.tag)) {
    return `<${vNode.tag}${stringFrom(vNode.props)}/>`;
  }

  const { props, children } = vNode;
  return `<${vNode.tag}${stringFrom(props)}>${
    children?.map((child) => stringify(child)).join("")
  }</${vNode.tag}>`;
}

function componentToString(vnode: VComponent): string {
  return stringify(vnode.ast);
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
