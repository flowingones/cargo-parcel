import { VElement, VNodeRef } from "./deps.ts";
import { ChangeSet } from "./mod.ts";

export interface CreateAttributePayload {
  vNode: VElement<Node>;
  name: string;
  value: string | boolean;
}

export interface UpdateAttributePayload {
  vNode: VElement<Node>;
  name: string;
  value: string | boolean;
}

export interface DeleteAttributePayload {
  vNode: VElement<Node>;
  name: string;
}

export interface AttributeChangeSet extends
  ChangeSet<
    CreateAttributePayload | UpdateAttributePayload | DeleteAttributePayload
  > {
  type: "attribute";
}

export function attribute(change: AttributeChangeSet) {
  if (change.action === "create" || change.action === "update") {
    createOrUpdate(<CreateAttributePayload> change.payload);
  }
  if (change.action === "delete") {
    remove(<DeleteAttributePayload> change.payload);
  }
}

function createOrUpdate({ vNode, name, value }: CreateAttributePayload) {
  if (
    name === "checked" && typeof value === "boolean"
  ) {
    (<HTMLFormElement> vNode.nodeRef)[name] = value;
  }
  if (name === "value") {
    (<HTMLFormElement> vNode.nodeRef)[name] = `${value}`;
  }
  if (name === "unsafeInnerHTML") {
    return (<HTMLFormElement> vNode.nodeRef).innerHTML = `${value}`;
  }
  (<HTMLElement> vNode.nodeRef).setAttribute(
    name,
    `${value}`,
  );
}

function remove({ name, vNode }: DeleteAttributePayload) {
  if (name === "checked") {
    (<HTMLFormElement> vNode.nodeRef)[name] = false;
  }
  if (name === "value") {
    (<HTMLFormElement> vNode.nodeRef).value = "";
  }
  (<HTMLElement> (<VNodeRef<Node>> vNode).nodeRef).removeAttribute(
    name,
  );
}

export function compareAttributes(
  vNode: VElement<Node>,
  previousVNode: VElement<Node>,
): ChangeSet<unknown>[] {
  const changes: AttributeChangeSet[] = [];
  const { ...previousProps } = previousVNode.props;

  for (const prop in vNode.props) {
    if (
      typeof vNode.props[prop] !== "string" &&
      typeof vNode.props[prop] !== "boolean"
    ) {
      continue;
    }

    // Attribute does not exist on previous vnode
    if (!previousProps[prop]) {
      changes.push(
        ...setAttribute(prop, vNode.props[prop], vNode),
      );
    }

    // Update attribute if value has changed
    if (vNode.props[prop] !== previousProps[prop]) {
      changes.push(...setAttribute(prop, vNode.props[prop], vNode));
      delete previousProps[prop];
    }

    // Remove left attributes from node
    for (const prop in previousProps) {
      if (!vNode.props[prop]) {
        changes.push({
          action: "delete",
          type: "attribute",
          payload: {
            vNode,
            name: prop,
          },
        });
      }
    }
  }

  return changes;
}

export function setAttribute(
  key: string,
  value: unknown,
  vNode: VElement<Node>,
): AttributeChangeSet[] {
  if (
    typeof value === "string" ||
    value === true
  ) {
    return [{
      action: "create",
      type: "attribute",
      payload: {
        vNode,
        name: key,
        value,
      },
    }];
  }
  if (value === false) {
    return [{
      type: "attribute",
      action: "delete",
      payload: {
        vNode,
        name: key,
      },
    }];
  }
  return [];
}
