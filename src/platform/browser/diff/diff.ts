import { VElement, VHooks, VNode, VText, VType } from "./deps.ts";

import {
  Action,
  type ChangeSet,
  hydrate,
  Props,
  render,
  toBeHydrated,
  toBeRendered,
  toBeUpdated,
  Type,
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

  parentVNode = parentVNode ? skipVComponents(parentVNode) : undefined;
  vNode = skipVComponents(vNode);
  previousVNode = previousVNode ? skipVComponents(previousVNode) : undefined;

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
        [Props.Type]: Type.Text,
        [Props.Action]: Action.Delete,
        [Props.Payload]: {
          vNode: previousVNode,
        },
      }];
    }
    if (previousVNode?.type === VType.ELEMENT) {
      return [{
        [Props.Type]: Type.Element,
        [Props.Action]: Action.Delete,
        [Props.Payload]: {
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
    if (vNode.hooks && vNode.ast) {
      passHooks(vNode.hooks, vNode.ast);
    }
    return skipVComponents(vNode.ast);
  }
  return vNode || undefined;
}

// TODO: Should be optimised in terms of size and performance
function passHooks(hooks: VHooks, to: { hooks?: VHooks }) {
  if (typeof to.hooks === "undefined") {
    to.hooks = {};
  }

  if (Array.isArray(hooks.onMount)) {
    if (Array.isArray(to.hooks.onMount)) {
      for (const hook of hooks.onMount) {
        const exists = to.hooks.onMount.find((ref) => {
          return ref === hook;
        });
        if (!exists) {
          to.hooks.onMount.push(hook);
        }
      }
    } else {
      to.hooks.onMount = [...hooks.onMount];
    }
  }

  if (Array.isArray(hooks.onDestroy)) {
    if (Array.isArray(to.hooks.onDestroy)) {
      for (const hook of hooks.onDestroy) {
        const exists = to.hooks.onDestroy.find((ref) => {
          return ref === hook;
        });
        if (!exists) {
          to.hooks.onDestroy.push(hook);
        }
      }
    } else {
      to.hooks.onDestroy = [...hooks.onDestroy];
    }
  }
}
