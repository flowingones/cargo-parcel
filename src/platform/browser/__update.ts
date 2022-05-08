import { compareChildren } from "./diff/children.ts";
import { changeText } from "./diff/text.ts";
import { VElement, VNode, VText } from "../../ast.ts";
import { updateEvents } from "./diff/event.ts";
import { compareAttributes } from "./diff/attributes.ts";
import { ChangeSet } from "./__dispatch.ts";

export function update(
  vnode: VElement | VText,
  previousVNode: VElement | VText,
) {
  const changes: ChangeSet<unknown>[] = [];

  if ("tag" in vnode && "tag" in previousVNode) {
    const nodeRef = <Node> previousVNode.nodeRef;
    if (vnode.tag === previousVNode.tag) {
      vnode.nodeRef = nodeRef;

      // Update event listener
      changes.push(
        ...updateEvents(nodeRef, vnode.eventsRefs, previousVNode.eventsRefs),
      );

      const [props, children] = split(vnode);
      const [previousProps, previousChildren] = split(previousVNode);

      // Update attributes
      changes.push(
        ...compareAttributes(props, previousProps, nodeRef),
      );

      // Update children
      changes.push(
        ...compareChildren(<Node> vnode.nodeRef, children, previousChildren),
      );
    }
  }

  if ("tag" in vnode && "text" in previousVNode) {
    // TODO: Delete text node
    // TODO: Create new elementNode
  }

  if ("text" in vnode && "text" in previousVNode) {
    if (vnode.text !== previousVNode.text) {
      vnode.nodeRef = previousVNode.nodeRef;
      if (vnode.nodeRef instanceof Text) {
        changes.push(changeText(vnode.nodeRef, `${vnode.text}`));
      }
    }
  }

  if ("text" in vnode && "tag" in previousVNode) {
    // TODO: Delete element node
    // TODO: Create text node
  }
  return changes;
}

export function toBeUpdated(
  node?: Node | null,
  vnode?: VNode,
  previousVNode?: VNode,
): boolean {
  if (node && vnode && previousVNode) {
    return true;
  }
  return false;
}

function split(
  velement: VElement,
): [props: { [key: string]: unknown }, children: VNode[] | undefined] {
  const { children, ...props } = velement.props;
  return [props, children];
}
