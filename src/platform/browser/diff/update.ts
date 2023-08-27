// TODO: replace "State" with dedicated VState type
import { VElement, VNode, VState, VText, VType } from "./deps.ts";

import {
  Action,
  ChangeSet,
  compareAttributes,
  diff,
  ElementChangeSet,
  EventChangeSet,
  Props,
  Type,
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

  vNode.hooks = previousVNode.hooks;

  // Tag did change
  if (vNode.tag !== (<VElement<Node>> previousVNode).tag) {
    changes.push(
      <ElementChangeSet> {
        [Props.Type]: Type.Element,
        [Props.Action]: Action.Replace,
        [Props.Payload]: {
          node: previousVNode.nodeRef,
          vNode,
        },
      },
    );
    skipPrevious = true;
  } else {
    vNode.nodeRef = previousVNode.nodeRef;
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
    [Props.Type]: Type.Element,
    [Props.Action]: Action.Replace,
    [Props.Payload]: {
      node: previousVNode.nodeRef,
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
      [Props.Type]: Type.Attribute,
      [Props.Action]: Action.Create,
      [Props.Payload]: {
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
  const text = isState(vNode) ? (<VState> vNode.text).get : vNode.text;
  const previousText = isState(previousVNode)
    ? (<VState> previousVNode.text).get
    : previousVNode.text;

  if (text !== previousText) {
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
    [Props.Type]: Type.Text,
    [Props.Action]: Action.Replace,
    [Props.Payload]: {
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
      [Props.Type]: Type.Event,
      [Props.Action]: Action.Delete,
      [Props.Payload]: {
        vNode: previousvNode,
        ...eventRef,
      },
    });
  });

  // Attach new events
  vNode?.eventRefs?.forEach((eventRef) => {
    changes.push({
      [Props.Type]: Type.Event,
      [Props.Action]: Action.Create,
      [Props.Payload]: {
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
    [Props.Type]: Type.Text,
    [Props.Action]: Action.Update,
    [Props.Payload]: {
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

export function isState(vNode: VText<Node>) {
  return (!!vNode && typeof vNode.text === "object" && "get" in vNode.text);
}
