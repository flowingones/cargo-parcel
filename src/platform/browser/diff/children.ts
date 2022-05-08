import { VNode } from "../../../ast.ts";
import { diffChildren } from "./__diff.ts";
import { ChangeSet } from "../__dispatch.ts";

export function compareChildren(
  node?: Node,
  children?: VNode[],
  previousChildren?: VNode[],
): ChangeSet<unknown>[] {
  const changes: ChangeSet<unknown>[] = [];
  let count = 0;
  if (children?.length) {
    for (const child of children) {
      changes.push(
        ...diffChildren(
          node,
          child,
          previousChildren ? previousChildren[count] : undefined,
        ),
      );
      count++;
    }
  }
  return changes;
}
