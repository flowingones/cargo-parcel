import { ChangeSet } from "../__dispatch.ts";

interface Attribute {
  name: string;
  value: string;
}

export interface AttributeChangeSet extends ChangeSet<Attribute> {
  type: "attribute";
}

export function attribute(attributeChange: AttributeChangeSet) {
  if (attributeChange.node instanceof HTMLElement) {
    attributeChange.node.setAttribute(
      attributeChange.payload.name,
      attributeChange.payload.value,
    );
  }
}

export function compareAttributes(
  props: { [key: string]: unknown },
  previousProps: { [key: string]: unknown },
  node: Node,
): ChangeSet<unknown>[] {
  const changes: ChangeSet<Attribute>[] = [];

  for (const prop in props) {
    if (typeof props[prop] !== "string") {
      continue;
    }

    // Attribute does not exist on previous vnode
    if (!previousProps[prop]) {
      changes.push({
        node,
        action: "create",
        type: "attribute",
        payload: {
          name: prop,
          value: <string> props[prop],
        },
      });
    }

    // Update attribute if content has changed
    if (props[prop] !== previousProps[prop]) {
      changes.push({
        node,
        action: "update",
        type: "attribute",
        payload: {
          name: prop,
          value: <string> props[prop],
        },
      });
      delete previousProps[prop];
    }

    // Remove left attributes from node
    for (const prop in previousProps) {
      changes.push({
        node,
        action: "delete",
        type: "attribute",
        payload: {
          name: prop,
          value: "",
        },
      });
    }
  }
  return changes;
}
