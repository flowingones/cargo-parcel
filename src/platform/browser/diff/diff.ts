import { VElement, VNode, VText, VType } from "./deps.ts";

import {
  type ChangeSet,
  hydrate,
  render,
  toBeHydrated,
  toBeRendered,
  toBeUpdated,
  update,
} from "./mod.ts";

interface DiffProps<T> {
  parentVNode?: VNode<T>;
  vNode?: VNode<T>;
  previousVNode?: VNode<T>;
  node?: T;
}

export function diff(
  props: DiffProps<Node>,
): ChangeSet<unknown>[] {
  let { vNode, previousVNode, parentVNode, node } = props;

  parentVNode = skipVComponents(parentVNode);
  vNode = skipVComponents(vNode);
  previousVNode = skipVComponents(previousVNode);

  if (toBeHydrated(node, vNode, previousVNode)) {
    return hydrate({
      node: <Node> node,
      vNode,
    });
  }

  if (toBeUpdated(vNode, previousVNode)) {
    return update(
      vNode,
      previousVNode,
    );
  }

  if (
    toBeRendered({
      parentVNode,
      vNode,
    })
  ) {
    return render({
      parentVNode,
      vNode,
    });
  }

  if (
    toBeDeleted({
      parentVNode,
      vNode,
      previousVNode,
    })
  ) {
    if (previousVNode?.type === VType.TEXT) {
      return [{
        type: "text",
        action: "delete",
        payload: {
          vNode: previousVNode,
        },
      }];
    }
    if (previousVNode?.type === VType.ELEMENT) {
      return [{
        type: "element",
        action: "delete",
        payload: {
          parentVNode,
          vNode: previousVNode,
        },
      }];
    }
  }
  return [];
}

function toBeDeleted(
  props: DiffProps<Node>,
) {
  if (
    props.parentVNode && typeof props.vNode === "undefined" &&
    props.previousVNode
  ) {
    return true;
  }
  return false;
}

function skipVComponents<T>(
  vNode: VNode<T>,
): VElement<T> | VText<T> | undefined {
  if (vNode?.type === VType.COMPONENT) {
    return skipVComponents(vNode.ast);
  }
  return vNode || undefined;
}
