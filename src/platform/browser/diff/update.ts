import { VElement, VNode, VText } from "./deps.ts";

import {
  ChangeSet,
  compareAttributes,
  diff,
  EventChangeSet,
  UpdateTextPayload,
} from "./mod.ts";

export function update(
  vNode: VElement<Node> | VText<Node> | undefined,
  previousVNode: VElement<Node> | VText<Node> | undefined,
): ChangeSet<unknown>[] {
  if (vNode?.type === "element" && previousVNode?.type === "element") {
    return updateElement(vNode, previousVNode);
  }

  if (vNode?.type === "text" && previousVNode?.type === "text") {
    return updateText(vNode, previousVNode);
  }

  return [];
}

function updateElement(
  vNode: VElement<Node>,
  previousVNode: VElement<Node>,
): ChangeSet<unknown>[] {
  const changes: ChangeSet<unknown>[] = [];

  const nodeRef = <Node> previousVNode.nodeRef;

  if (vNode.tag === previousVNode.tag) {
    vNode.nodeRef = nodeRef;

    // Update event listener
    changes.push(
      ...updateEvents(vNode, previousVNode),
    );

    // Update attributes
    changes.push(
      ...compareAttributes(vNode, previousVNode),
    );

    // Update children
    changes.push(
      ...updateChildren({
        vNode,
        previousVNode,
      }),
    );
    return changes;
  }

  return changes;
}

function updateText(
  vNode: VText<Node>,
  previousVNode: VText<Node>,
): ChangeSet<unknown>[] {
  vNode.nodeRef = previousVNode.nodeRef;
  if (vNode.text !== previousVNode.text) {
    if (vNode.nodeRef instanceof Text) {
      return [updateTextContent(vNode)];
    }
  }
  return [];
}

export function updateEvents(
  vNode: VElement<Node>,
  previousvNode?: VElement<Node>,
): ChangeSet<unknown>[] {
  const changes: EventChangeSet[] = [];

  // Remove previous events
  previousvNode?.eventsRefs?.forEach((previousEvent) => {
    changes.push({
      action: "delete",
      type: "event",
      payload: {
        vNode: previousvNode,
        ...previousEvent,
      },
    });
  });

  // Attach new events
  vNode?.eventsRefs?.forEach((event) => {
    changes.push({
      action: "create",
      type: "event",
      payload: {
        vNode,
        ...event,
      },
    });
  });

  return changes;
}

// TODO: Inline function
function updateTextContent(
  vNode: VText<Node>,
): ChangeSet<UpdateTextPayload> {
  return {
    type: "text",
    action: "update",
    payload: {
      vNode,
    },
  };
}

interface UpdateChildrenProps {
  vNode: VElement<Node> | VText<Node>;
  previousVNode?: VElement<Node> | VText<Node>;
}

export function updateChildren(
  props: UpdateChildrenProps,
): ChangeSet<unknown>[] {
  const changes: ChangeSet<unknown>[] = [];
  props.vNode?.children?.forEach((child, index) => {
    changes.push(...diff({
      parentVNode: props.vNode,
      vNode: child,
      previousVNode: props.previousVNode?.children?.at(index),
    }));
  });
  return changes;
}

export function toBeUpdated(
  vNode?: VNode<Node>,
  previousVNode?: VNode<Node>,
): boolean {
  if (vNode && previousVNode) {
    return true;
  }
  return false;
}
