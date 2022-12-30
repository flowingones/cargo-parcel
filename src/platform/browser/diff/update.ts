import { VElement, VNode, VText, VType } from "./deps.ts";

import {
  ChangeSet,
  compareAttributes,
  diff,
  EventChangeSet,
  UpdateTextPayload,
} from "./mod.ts";

export function update(
  vNode?: VElement<Node> | VText<Node>,
  previousVNode?: VElement<Node> | VText<Node>,
): ChangeSet<unknown>[] {
  if (vNode?.type === VType.ELEMENT && previousVNode?.type === VType.ELEMENT) {
    return updateElement(vNode, previousVNode);
  }

  if (vNode?.type === VType.ELEMENT && previousVNode?.type === VType.TEXT) {
    return replaceTextWithElement(vNode, previousVNode);
  }

  if (vNode?.type === VType.TEXT && previousVNode?.type === VType.TEXT) {
    return updateText(vNode, previousVNode);
  }

  if (vNode?.type === VType.TEXT && previousVNode?.type === VType.ELEMENT) {
    return replaceElementWithText(vNode, previousVNode);
  }

  return [];
}

function updateElement(
  vNode: VElement<Node>,
  previousVNode: VElement<Node>,
): ChangeSet<unknown>[] {
  const changes: ChangeSet<unknown>[] = [];
  let skipPrevious = false;

  vNode.nodeRef = <Node> previousVNode.nodeRef;

  // Tag did change
  if (vNode.tag !== (<VElement<Node>> previousVNode).tag) {
    changes.push({
      type: "element",
      action: "replace",
      payload: {
        vNode,
      },
    });
    skipPrevious = true;
  }

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
      previousVNode: skipPrevious ? undefined : previousVNode,
    }),
  );

  return changes;
}

function replaceTextWithElement(
  vNode: VElement<Node>,
  previousVNode: VText<Node>,
) {
  const changes: ChangeSet<unknown>[] = [];

  vNode.nodeRef = previousVNode.nodeRef;

  changes.push({
    type: "element",
    action: "replace",
    payload: {
      vNode,
    },
  });

  // Add events
  changes.push(
    ...updateEvents(vNode),
  );

  // Add attributes
  for (const prop in vNode.props) {
    changes.push({
      type: "attribute",
      action: "create",
      payload: {
        vNode,
        name: prop,
        value: <string> vNode.props[prop],
      },
    });
  }

  vNode.children?.forEach((child) => {
    changes.push(...diff({ parentVNode: vNode, vNode: child }));
  });

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

function replaceElementWithText(
  vNode: VText<Node>,
  previousVNode: VElement<Node>,
): ChangeSet<unknown>[] {
  vNode.nodeRef = previousVNode.nodeRef;
  return [{
    type: "text",
    action: "replace",
    payload: {
      vNode,
    },
  }];
}

export function updateEvents(
  vNode: VElement<Node>,
  previousvNode?: VElement<Node>,
): ChangeSet<unknown>[] {
  const changes: EventChangeSet[] = [];

  // Remove previous events
  previousvNode?.eventRefs?.forEach((eventRef) => {
    changes.push({
      action: "delete",
      type: "event",
      payload: {
        vNode: previousvNode,
        ...eventRef,
      },
    });
  });

  // Attach new events
  vNode?.eventRefs?.forEach((eventRef) => {
    changes.push({
      action: "create",
      type: "event",
      payload: {
        vNode,
        ...eventRef,
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
  let previousChildren: VNode<Node>[] = [];
  if (props.previousVNode && Array.isArray(props.previousVNode.children)) {
    previousChildren = [...props.previousVNode.children];
  }
  props.vNode?.children?.forEach((child) => {
    changes.push(...diff({
      parentVNode: props.vNode,
      vNode: child,
      previousVNode: previousChildren?.shift(),
    }));
  });

  previousChildren?.forEach((previousChild) => {
    changes.push(
      ...diff({ parentVNode: props.vNode, previousVNode: previousChild }),
    );
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
