import { VElement, VNode, VText } from "./deps.ts";
import { ChangeSet, diff, TextChangeSet } from "./mod.ts";

interface RenderProps {
  parentVNode: VNode<Node>;
  vNode: VNode<Node>;
}

export function render(
  props: RenderProps,
): ChangeSet<unknown>[] {
  if (!props.vNode) {
    return [];
  }

  if (props.vNode.type === "component") {
    return render({
      parentVNode: props.parentVNode,
      vNode: props.vNode?.ast,
    });
  }

  if (props.vNode.type === "element") {
    return renderElement(props.parentVNode, props.vNode);
  }

  if (props.vNode.type === "text") {
    return renderText(props.parentVNode, props.vNode);
  }

  return [];
}

function renderElement(
  parentVNode: VNode<Node>,
  vNode: VElement<Node>,
): ChangeSet<unknown>[] {
  const changes: ChangeSet<unknown>[] = [];

  // Create DOM node and link it to the vnode
  changes.push({
    type: "element",
    action: "create",
    payload: {
      parentVNode,
      vNode,
    },
  });

  // Attach the nodeRef to the DOM
  changes.push({
    type: "element",
    action: "attach",
    payload: {
      parentVNode,
      vNode,
    },
  });

  // Attach events
  vNode.eventsRefs.forEach((event) => {
    changes.push({
      type: "event",
      action: "create",
      payload: {
        vNode,
        name: event.name,
        listener: event.listener,
      },
    });
  });

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

function renderText(
  parentVNode: VNode<Node>,
  vNode: VText<Node>,
): TextChangeSet[] {
  return [{
    action: "create",
    type: "text",
    payload: {
      vNode: vNode,
    },
  }, {
    action: "attach",
    type: "text",
    payload: {
      parentVNode,
      vNode,
    },
  }];
}

export function toBeRendered(
  props: RenderProps,
) {
  if (props.parentVNode && props.vNode) {
    return true;
  }
  return false;
}
