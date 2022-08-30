import { type VElement } from "./deps.ts";
import type { ChangeSet } from "./mod.ts";

export interface CreateElementPayload {
  vNode: VElement<Node>;
}

export interface AttachElementPayload {
  parentVNode: VElement<Node>;
  vNode: VElement<Node>;
}

export interface ReplaceElementPayload {
  node: Node;
  vNode: VElement<Node>;
}

export interface UpdateElementPayload {
  parentVNode: VElement<Node>;
  node: Node;
  vNode: VElement<Node>;
}

export interface DeleteElementPayload {
  parentVNode: VElement<Node>;
  vNode: VElement<Node>;
}

export interface ElementChangeSet extends
  ChangeSet<
    | CreateElementPayload
    | AttachElementPayload
    | ReplaceElementPayload
    | UpdateElementPayload
    | DeleteElementPayload
  > {
  type: "element";
  action: "create" | "attach" | "replace" | "update" | "delete";
}

export function element(change: ElementChangeSet): void {
  if (change.action === "create") {
    create(<CreateElementPayload> change.payload);
  }

  if (change.action === "attach") {
    attach(<AttachElementPayload> change.payload);
  }

  if (change.action === "replace") {
    replace(<ReplaceElementPayload> change.payload);
  }

  if (change.action === "update") {
    update(<UpdateElementPayload> change.payload);
  }

  if (change.action === "delete") {
    remove(<DeleteElementPayload> change.payload);
  }
}

function create(payload: CreateElementPayload): void {
  if (!payload.vNode) return;
  payload.vNode.nodeRef = document.createElement(payload.vNode.tag);
}

function attach(payload: AttachElementPayload): void {
  if (payload.vNode.type === "element" && payload.vNode.nodeRef) {
    (<Node> payload.parentVNode.nodeRef)?.appendChild(payload.vNode.nodeRef);
  }
}

function replace(payload: ReplaceElementPayload): void {
  if (payload.vNode.type === "element") {
    const node = document.createElement(payload.vNode.tag);

    payload.node.parentElement?.replaceChild(
      node,
      payload.node,
    );

    payload.vNode.nodeRef = node;
  }
}

function update(
  payload: UpdateElementPayload,
): void {
  (<Node> payload.parentVNode.nodeRef).replaceChild(
    <Node> payload.vNode.nodeRef,
    payload.node,
  );
}

function remove(payload: DeleteElementPayload): void {
  (<Node> payload.parentVNode.nodeRef).removeChild(
    <Node> payload.vNode.nodeRef,
  );
}
