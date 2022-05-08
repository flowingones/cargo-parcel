import { VNode } from "../../ast.ts";
import { diffChildren } from "./diff/mod.ts";
import { ChangeSet } from "./__dispatch.ts";

/*
 * Compare VNode tree with DOM node tree and create a change set based on the difference.
 */
export function hydrate(node: Node, vnode: VNode): ChangeSet<unknown>[] {
  const changes: ChangeSet<unknown>[] = [];
  if (!vnode) return changes;

  if ("tag" in vnode) {
    if (!(node instanceof HTMLElement)) {
      throw new Error(
        "Element could not be hydrated. Because the type was a mismatch!",
      );
    }
    vnode.eventsRefs?.forEach((eventRef) => {
      changes.push({
        node: node,
        action: "create",
        type: "event",
        payload: eventRef,
      });
    });

    let count = 0;
    collect(vnode.props.children)?.forEach((child) => {
      changes.push(...diffChildren(node.childNodes.item(count), child));
      count++;
    });

    vnode.nodeRef = node;
  }

  if ("text" in vnode) {
    if (!(node instanceof Text)) {
      throw new Error(
        `(${node.textContent}): Text could not be hydrated. Because the type was a mismatch!`,
      );
    }
    vnode.nodeRef = node;
  }
  return changes;
}

/*
 * Collect preceding VText nodes into 1 single VText node.
 */
function collect(vnodes?: VNode[]): VNode[] | undefined {
  return vnodes?.filter((vnode, index, source) => {
    if (!vnode) return false;
    if ("tag" in vnode) return true;

    const nextVNode = source[index + 1];

    if (!nextVNode) {
      return true;
    }

    if ("text" in vnode && "tag" in nextVNode) {
      return true;
    }

    if ("text" in vnode && "text" in nextVNode) {
      nextVNode.text = `${vnode.text}${nextVNode.text}`;
      nextVNode.nodeRef = vnode.nodeRef;
      return false;
    }

    return false;
  });
}
export function toBeHydrated(
  node?: Node | null,
  vnode?: VNode,
  previousVNode?: VNode,
): boolean {
  if (node && vnode && !previousVNode) {
    return true;
  }
  return false;
}
