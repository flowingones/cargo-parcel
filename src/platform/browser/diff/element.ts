import type { VNode } from "../../../ast.ts";
import type { ChangeSet } from "../__dispatch.ts";

export interface ElementChangePayload {
  vnode: VNode;
  node?: Node;
}

export interface ElementChangeSet extends ChangeSet<ElementChangePayload> {
  type: "node";
}

export function element(change: ElementChangeSet): void {
  if (change.action === "create") {
    create(change.node, change.payload.vnode);
  }

  if (change.payload.node) {
    if (change.action === "update") {
      update(change.node, change.payload.node);
    }
    if (change.action === "delete") {
      remove(change.node, change.payload.node);
    }
  }
}

function create(parentNode: Node, vnode: VNode): void {
  if (!vnode) return;

  if (!(parentNode instanceof Document)) {
    throw new Error('The parent node is not of type "Document"!');
  }

  if ("tag" in vnode) {
    const node = parentNode.createElement(vnode.tag);
    vnode.nodeRef = node;
    parentNode.appendChild(node);
  }
}

function update(
  node: Node,
  newNode: Node,
): void {
  if (node instanceof Element) {
    node.replaceWith(newNode);
  }
}

function remove(parentNode: Node, node: Node): void {
  parentNode.removeChild(node);
}
