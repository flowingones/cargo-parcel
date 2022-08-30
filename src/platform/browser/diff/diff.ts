import type { VElement, VNode, VText } from "./deps.ts";

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
  vNode: VNode<T>;
  previousVNode?: VNode<T>;
  node?: T;
  parentVNode?: VNode<T>;
}

export function diff(
  props: DiffProps<Node>,
): ChangeSet<unknown>[] {
  if (!props.vNode) {
    return [];
  }

  if (toBeHydrated(props.node, props.vNode, props.previousVNode)) {
    return hydrate({
      node: <Node> props.node,
      vNode: skipVComponents(props.vNode),
    });
  }

  if (toBeUpdated(props.vNode, props.previousVNode)) {
    return update(
      skipVComponents(props.vNode),
      skipVComponents(props.previousVNode),
    );
  }

  if (
    toBeRendered({
      parentVNode: skipVComponents(props.parentVNode),
      vNode: skipVComponents(props.vNode),
    })
  ) {
    return render({
      parentVNode: skipVComponents(props.parentVNode),
      vNode: skipVComponents(props.vNode),
    });
  }

  return [];
}

function skipVComponents<T>(
  vNode: VNode<T>,
): VElement<T> | VText<T> | undefined {
  if (vNode?.type === "component") {
    return skipVComponents(vNode.ast);
  }
  return vNode || undefined;
}
