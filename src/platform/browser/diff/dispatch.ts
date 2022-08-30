import {
  attribute,
  AttributeChangeSet,
  element,
  ElementChangeSet,
  event,
  EventChangeSet,
  text,
  TextChangeSet,
} from "./mod.ts";

type Action = "create" | "update" | "delete" | string;
type Type = "element" | "event" | "attribute" | "text" | string;

export interface ChangeSet<T> {
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
  if (change.type === "element") {
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
