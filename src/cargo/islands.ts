import { parse, VComponent, VElement, VNode } from "./deps.ts";

export interface Island {
  class: string;
  path: string;
  props: Record<string, unknown>;
}

/**
 * Find islands in vNode
 * @param {VNode} vNode - The vnode to find the islands in it
 * @param {Island[]} islands - The islands to find in the vnode
 */
export function findIslands(
  vNode: VNode<unknown>,
  islands: Record<string, JSX.Component>,
): Island[] {
  const cache: Island[] = [];
  if (vNode?.type === "text") return [];

  if (vNode?.type === "element") {
    vNode.children?.forEach((child) => {
      cache.push(...findIslands(child, islands));
    });
    return cache;
  }

  if (vNode?.type === "component") {
    const island = isIsland(vNode, islands);
    if (island) {
      (typeof (<VElement<unknown>> vNode.ast).props.class === "string")
        ? (<VElement<unknown>> vNode.ast).props.class =
          (<VElement<unknown>> vNode.ast).props.class + " " + island.class
        : (<VElement<unknown>> vNode.ast).props.class = island.class;
      return [island];
    }
    return [...findIslands(vNode.ast, islands)];
  }

  return cache;
}

function isIsland(
  vComponent: VComponent<unknown>,
  islands: Record<string, JSX.Component>,
): Island | undefined {
  for (const key in islands) {
    if (islands[key] === vComponent.fn) {
      return {
        class: `_box_${crypto.randomUUID().slice(-6)}`,
        path: parse(key).name.replaceAll("$", ""),
        props: vComponent.props,
      };
    }
  }
  return;
}
