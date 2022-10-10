import type { VNode, VNodeRef, VText } from "./deps.ts";
import type { ChangeSet } from "./mod.ts";

export interface CreateTextPayload {
  vNode: VText<Node>;
}

export interface AttachTextPayload {
  parentVNode: VNode<Node>;
  vNode: VText<Node>;
}

export interface ReplaceTextPayload {
  vNode: VText<Node>;
}

export interface UpdateTextPayload {
  vNode: VText<Node>;
}

export interface DeleteTextPayload {
  vNode: VText<Node>;
}

export interface TextChangeSet extends
  ChangeSet<
    | CreateTextPayload
    | AttachTextPayload
    | ReplaceTextPayload
    | UpdateTextPayload
    | DeleteTextPayload
  > {
  type: "text";
}

export function text(changeSet: TextChangeSet): void {
  if (changeSet.action === "create") {
    create(<CreateTextPayload> changeSet.payload);
  }
  if (changeSet.action === "attach") {
    attach(<AttachTextPayload> changeSet.payload);
  }
  if (changeSet.action === "replace") {
    replace(<ReplaceTextPayload> changeSet.payload);
  }
  if (changeSet.action === "update") {
    update(<UpdateTextPayload> changeSet.payload);
  }
  if (changeSet.action === "delete") {
    remove(<DeleteTextPayload> changeSet.payload);
  }
}

function create(payload: CreateTextPayload) {
  const vNode = payload.vNode;
  const textNode = new Text(vNode.text.toString());
  vNode.nodeRef = textNode;
}

function attach(payload: AttachTextPayload) {
  (<Node> (<VNodeRef<Node>> payload.parentVNode).nodeRef).appendChild(
    <Node> (payload.vNode).nodeRef,
  );
}

function replace(payload: ReplaceTextPayload) {
  const text = new Text(`${payload.vNode.text}`);
  payload.vNode.nodeRef?.parentNode?.replaceChild(text, payload.vNode.nodeRef);
  payload.vNode.nodeRef = text;
}

function update(payload: UpdateTextPayload) {
  (<Text> payload.vNode.nodeRef).textContent = payload.vNode
    .text.toString();
}

function remove(payload: DeleteTextPayload) {
  (<Text> payload.vNode.nodeRef).remove();
}
