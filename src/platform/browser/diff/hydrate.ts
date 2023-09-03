import { VElement, VNode, VText, VType } from "./deps.ts";
import {
  Action,
  ChangeSet,
  diff,
  EventChangeSet,
  Props,
  setAttribute,
  Type,
} from "./mod.ts";

interface HydrateProps {
  vNode: VElement<Node> | VText<Node> | undefined;
  node: Node;
}

/*
 * Compare VNode tree with DOM node tree and create a change set based on the difference.
 */
export function hydrate(
  props: HydrateProps,
): ChangeSet<unknown>[] {
  if (props.vNode?.type === VType.ELEMENT) {
    return element(<HydrateElementProps> props);
  }
  if (props.vNode?.type === VType.TEXT) {
    return text(props.node, props.vNode);
  }
  return [];
}

interface HydrateElementProps {
  vNode: VElement<Node>;
  parentVNode?: VElement<Node>;
  node: Node;
}

/*
 * Hydrate "VElement"
 */
function element(
  props: HydrateElementProps,
) {
  const changes: ChangeSet<unknown>[] = [];

  // Replace dom node with effective vnode type
  if (props.node.nodeName.toLowerCase() !== props.vNode.tag) {
    changes.push({
      [Props.Type]: Type.Element,
      [Props.Action]: Action.Replace,
      [Props.Payload]: { vNode: props.vNode, node: props.node },
    });
  } else {
    // Link current dom node with the vnode
    props.vNode.nodeRef = props.node;

    props.vNode.hooks?.onMount?.forEach((hook) => {
      const onDestroy = hook();
      if (typeof onDestroy === "function" && props.vNode.hooks) {
        if (Array.isArray(props.vNode.hooks.onDestroy)) {
          props.vNode.hooks.onDestroy.push(onDestroy);
          return;
        }
        props.vNode.hooks.onDestroy = [onDestroy];
      }
    });
  }

  // Attach events to the dom node
  props.vNode.eventRefs?.forEach((eventRef) => {
    changes.push(
      <EventChangeSet> {
        [Props.Type]: Type.Event,
        [Props.Action]: Action.Create,
        [Props.Payload]: { vNode: props.vNode, ...eventRef },
      },
    );
  });

  for (const prop in props.vNode.props) {
    changes.push(...setAttribute(prop, props.vNode.props[prop], props.vNode));
  }

  const children = props.vNode.children?.filter((c) => c != null);
  children?.forEach((child, index) => {
    changes.push(
      ...diff({
        node: props.vNode.nodeRef?.childNodes.item(index),
        vNode: child,
        parentVNode: props.vNode,
      }),
    );
  });

  return changes;
}

/*
 * Hydrate "VText"
 */
function text(node: Node, vText: VText<Node>) {
  const changes: ChangeSet<unknown>[] = [];
  vText.nodeRef = node;

  if (!(node instanceof Text) || node.textContent !== vText.text) {
    changes.push({
      [Props.Type]: Type.Text,
      [Props.Action]: Action.Replace,
      [Props.Payload]: {
        vNode: vText,
      },
    });
  }

  return changes;
}

export function toBeHydrated<T>(
  node?: T | null,
  vNode?: VNode<T>,
  previousVNode?: VNode<T>,
): boolean {
  if (node && vNode && !previousVNode) {
    return true;
  }
  return false;
}
