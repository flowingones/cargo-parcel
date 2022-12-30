import { VElement, VNode, VText, VType } from "./deps.ts";
import { ChangeSet, diff, EventChangeSet, setAttribute } from "./mod.ts";

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

  console.log(props);

  // Replace dom node with effective vnode type
  if (props.node.nodeName.toLowerCase() !== props.vNode.tag) {
    changes.push({
      action: "replace",
      type: "element",
      payload: { vNode: props.vNode, node: props.node },
    });
  } else {
    // Link current dom node with the vnode
    props.vNode.nodeRef = props.node;
    props.vNode.hooks?.onMount?.forEach((hook) => {
      hook();
    });
  }

  // Attach events to the dom node
  props.vNode.eventRefs?.forEach((eventRef) => {
    changes.push(
      <EventChangeSet> {
        action: "create",
        type: "event",
        payload: { vNode: props.vNode, ...eventRef },
      },
    );
  });

  for (const prop in props.vNode.props) {
    changes.push(...setAttribute(prop, props.vNode.props[prop], props.vNode));
  }

  const children = collectTextNodes(props.vNode.children);
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
      type: "text",
      action: "replace",
      payload: {
        vNode: vText,
      },
    });
  }

  return changes;
}

/*
 * Collect preceding VText nodes into 1 single VText node.
 */
function collectTextNodes<T>(vNodes?: VNode<T>[]): VNode<T>[] | undefined {
  return vNodes?.filter((vNode, index, source) => {
    if (!vNode) return false;

    if (vNode.type === VType.ELEMENT || vNode.type === VType.COMPONENT) {
      return true;
    }

    const nextVNode = source[index + 1];

    if (!nextVNode) {
      return true;
    }

    if (nextVNode.type !== VType.TEXT) {
      return true;
    }

    nextVNode.text = `${vNode.text}${nextVNode.text}`;
    nextVNode.nodeRef = vNode.nodeRef;
    return false;
  });
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
