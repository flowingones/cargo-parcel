import type { VElement, VNode, VText } from "../../../ast.ts";
import type { ChangeSet } from "../__dispatch.ts";

import { toBeUpdated, update } from "../__update.ts";
import { hydrate, toBeHydrated } from "../__hydrate.ts";
import { render, toBeRendered } from "../__render.ts";

export function diff(
  parentNode: Node,
  vnode?: VNode,
  previousVNode?: VNode,
): ChangeSet<unknown>[] {
  if (toBeHydrated(parentNode.firstChild, vnode, previousVNode)) {
    return hydrate(<Node> parentNode.firstChild, vnode);
  }
  if (toBeUpdated(parentNode.firstChild, vnode, previousVNode)) {
    return update(<VElement | VText> vnode, <VElement | VText> previousVNode);
  }
  if (toBeRendered()) {
    return render(parentNode, vnode);
  }
  return [];
}

export function diffChildren(
  node?: Node | null,
  vnode?: VNode,
  previousVNode?: VNode,
): ChangeSet<unknown>[] {
  if (toBeHydrated(node, vnode, previousVNode)) {
    return hydrate(<Node> node, vnode);
  }
  if (toBeUpdated(node, vnode, previousVNode)) {
    return update(<VElement | VText> vnode, <VElement | VText> previousVNode);
  }
  if (toBeRendered(node?.parentNode, vnode, previousVNode)) {
    return render(<Node> node?.parentNode, vnode);
  }
  return [];
}
