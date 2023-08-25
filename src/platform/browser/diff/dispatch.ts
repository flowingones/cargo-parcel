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

export enum Action {
  Create,
  Update,
  Attach,
  Replace,
  Delete,
}
export enum Type {
  Element,
  Event,
  Attribute,
  Text,
}

export enum Props {
  Type,
  Action,
  Payload,
}

export interface ChangeSet<T> {
  [Props.Type]: Type;
  [Props.Action]: Action;
  [Props.Payload]: T;
}

function change(changeSet: ChangeSet<unknown>) {
  switch (changeSet[Props.Type]) {
    case Type.Attribute:
      return attribute(<AttributeChangeSet> changeSet);
    case Type.Event:
      return event(<EventChangeSet> changeSet);
    case Type.Element:
      return element(<ElementChangeSet> changeSet);
    case Type.Text:
      return text(<TextChangeSet> changeSet);
  }
}

export function dispatch(changes: ChangeSet<unknown>[]) {
  while (changes.length) {
    const changeSet = changes.shift();
    if (changeSet) change(changeSet);
  }
}
