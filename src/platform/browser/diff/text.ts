import type { ChangeSet } from "../__dispatch.ts";

interface TextPayload {
  text: string;
}

export interface TextChangeSet extends ChangeSet<TextPayload> {
  node: Node | Text;
  type: "text";
}
interface CreateTextChangeSet extends TextChangeSet {
  action: "create";
  node: Text;
}

export function text(changeSet: TextChangeSet): void {
  if (changeSet.action === "create") {
    create(<CreateTextChangeSet> changeSet);
  }
  if (changeSet.action === "update") {
    update(changeSet);
  }
  if (changeSet.action === "delete") {
    remove(changeSet);
  }
}

/**
 * @deprecated us text() instead.
 */
export const dispatchTextChange = text;

function create(changeSet: CreateTextChangeSet) {
  const textNode = new Text(changeSet.payload.text);
  changeSet.node.appendChild(textNode);
}

function update(changeSet: TextChangeSet) {
  changeSet.node.textContent = changeSet.payload.text;
}

function remove(changeSet: TextChangeSet) {
  (<Text> changeSet.node).remove();
}

export function changeText(node: Text, text: string): TextChangeSet {
  return {
    type: "text",
    action: "update",
    node,
    payload: {
      text,
    },
  };
}
