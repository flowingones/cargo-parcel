/// <reference lib="dom" />
import { VNode, VNodeRef } from "./deps.ts";
import { type ChangeSet } from "./mod.ts";

interface EventChangePayload extends JSX.EventRef {
  vNode: VNode<Node>;
}

export interface EventChangeSet extends ChangeSet<EventChangePayload> {
  type: "event";
}

export function event(change: EventChangeSet): void {
  if (change.action === "create") {
    create(change.payload);
  }
  if (change.action === "delete") {
    remove(change.payload);
  }
}

function create(
  payload: EventChangePayload,
): void {
  (<VNodeRef<Node>> payload.vNode).nodeRef?.addEventListener(
    payload.name,
    payload.listener,
  );
}

function remove(
  payload: EventChangePayload,
) {
  (<VNodeRef<Node>> payload.vNode).nodeRef?.removeEventListener(
    payload.name,
    payload.listener,
  );
}
