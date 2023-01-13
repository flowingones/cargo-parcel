import { parse, VComponent, VElement, VNode, VType } from "./deps.ts";
import { info } from "cargo/utils/mod.ts";

export interface Island {
  class: string;
  path: string;
  props: Record<string, unknown>;
}

/**
 * Find islands in vNode and attach css class to closest
 * vElement for hydration in the frontend
 * @param {VNode} vNode - The vNode to find the islands in
 * @param {Island[]} islands - The islands to search in the vNode
 */
export function findIslands(
  vNode: VNode<unknown>,
  islands: Record<string, JSX.Component>,
): Island[] {
  const cache: Island[] = [];
  if (vNode?.type === VType.TEXT) return [];

  if (vNode?.type === VType.ELEMENT) {
    vNode.children?.forEach((child) => {
      cache.push(...findIslands(child, islands));
    });
    return cache;
  }

  if (vNode?.type === VType.COMPONENT) {
    const island = isIsland(vNode, islands);
    if (island) {
      attachIslandClassToVElement(vNode.ast, island);
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

function attachIslandClassToVElement(
  vNode: VNode<unknown> | undefined,
  island: Island,
): void {
  const vElement = findClosestVElement(vNode);

  if (vElement) {
    typeof vElement.props.class === "string"
      ? vElement.props.class = vElement.props.class + " " + island.class
      : vElement.props.class = island.class;
    return;
  }

  info(
    `Island (${island.path})`,
    `No vElement found to attach the class "${island.class}" for island hydration in the frontend`,
    "CARGO PARCEL",
  );
}

function findClosestVElement(
  vNode: VNode<unknown>,
): VElement<unknown> | undefined {
  if (vNode?.type === VType.TEXT || !vNode) return;

  if (vNode?.type === VType.COMPONENT) {
    return findClosestVElement(vNode.ast);
  }

  // Only type VElement is left
  return vNode;
}
