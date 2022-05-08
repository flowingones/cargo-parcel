import type { VElement, VNode, VText } from "../../ast.ts";
import { diffChildren } from "./diff/__diff.ts";
import { ChangeSet, flush } from "./__dispatch.ts";

export function render(node: Node, vnode: VNode) {
  const changes: ChangeSet<unknown>[] = [];
  if (!vnode) return changes;

  if ("tag" in vnode) {
    changes.push({
      type: "node",
      action: "create",
      node,
      payload: {
        vnode,
      },
    });
    if (vnode.props.children) {
      for (const child of vnode.props.children) {
        if (child) {
          flush([
            <ChangeSet<unknown>> {
              type: "node",
              action: "create",
              node: node,
              payload: {
                vnode: child,
              },
            },
          ]);

          diffChildren(
            <Node> (<VElement | VText> child).nodeRef,
            <VNode> child,
            undefined,
          );
        }
      }
    }
  }

  if ("text" in vnode) {
    changes.push(
      <ChangeSet<unknown>> {
        type: "text",
        action: "create",
        node,
        payload: {
          text: vnode.text,
        },
      },
    );
  }

  return changes;
}

export function toBeRendered(
  node?: Node | null,
  vnode?: VNode,
  previousVNode?: VNode,
) {
  if (!node && vnode && !previousVNode) {
    return true;
  }
  return false;
}
