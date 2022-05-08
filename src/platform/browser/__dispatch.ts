import { event, EventChangeSet } from "./diff/event.ts";
import { attribute, AttributeChangeSet } from "./diff/attributes.ts";
import { element, ElementChangeSet } from "./diff//element.ts";
import { text, TextChangeSet } from "./diff/text.ts";

type Action = "create" | "update" | "delete";
type Type = "node" | "event" | "attribute" | "text";

export interface ChangeSet<T> {
  node: Node;
  action: Action;
  type: Type;
  payload: T;
}

function dispatch(change: ChangeSet<unknown>) {
  if (change.type === "attribute") {
    attribute(<AttributeChangeSet> change);
  }
  if (change.type === "event") {
    event(<EventChangeSet> change);
  }
  if (change.type === "node") {
    element(<ElementChangeSet> change);
  }
  if (change.type === "text") {
    text(<TextChangeSet> change);
  }
}

export function flush(changes: ChangeSet<unknown>[]) {
  while (changes.length) {
    const change = changes.shift();
    if (change) dispatch(change);
  }
}
