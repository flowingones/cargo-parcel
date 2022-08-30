import { VComponent, VNode } from "./deps.ts";

export function findIslands(
  vNode: VNode<unknown>,
): VComponent<unknown>[] {
  if (vNode?.type === "component") {
    return [vNode];
  }
  if (vNode?.type) {
    return findIslands(vNode);
  }
  return [];
}
