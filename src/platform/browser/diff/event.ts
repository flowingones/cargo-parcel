/// <reference lib="dom" />
import "../../../jsx/types.ts";
import type { ChangeSet } from "../__dispatch.ts";

export interface EventChangeSet extends ChangeSet<JSX.EventRef> {
  type: "event";
}

export function event(eventChange: EventChangeSet): void {
  if (eventChange.action === "create") {
    attach(
      eventChange.node,
      eventChange.payload.name,
      eventChange.payload.listener,
    );
  }
  if (eventChange.action === "delete") {
    remove(
      eventChange.node,
      eventChange.payload.name,
      eventChange.payload.listener,
    );
  }
}

function attach(
  node: Node,
  name: string,
  listener: () => void,
): void {
  if (typeof listener === "function") {
    node.addEventListener(name, listener);
  } else {
    console.error("Listener is not of type function!");
  }
}

function remove(
  node: Node,
  name: string,
  listener: () => void,
) {
  node.removeEventListener(name, listener);
}

export function updateEvents(
  node: Node,
  events?: JSX.EventRef[],
  previousEvents?: JSX.EventRef[],
): ChangeSet<unknown>[] {
  const changes: EventChangeSet[] = [];

  // Remove previous events
  if (previousEvents?.length) {
    for (const previousEvent of previousEvents) {
      changes.push({
        node,
        action: "delete",
        type: "event",
        payload: previousEvent,
      });
    }
  }

  // Attach new events
  if (events?.length) {
    for (const event of events) {
      changes.push({
        node,
        action: "create",
        type: "event",
        payload: event,
      });
    }
  }
  return changes;
}
