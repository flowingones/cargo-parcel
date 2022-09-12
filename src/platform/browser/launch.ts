/// <reference no-default-lib="true" />
/// <reference lib="DOM" />
/// <reference lib="deno.ns" />

import { tag } from "../../tag.ts";
import {
  AST,
  diff,
  flush,
  listener,
  VComponent,
  VElement,
  VNode,
} from "./deps.ts";

interface Island {
  id: string;
  node: JSX.Component;
}

function sync(node: Node, vNode: VNode<Node>) {
  // Register the listener to trigger re-rendering
  listener(() => {
    const previousVNode = vNode;
    vNode = AST.update(vNode);
    const changeSet = diff({ vNode, previousVNode });
    flush(changeSet);
  });

  const changeSet = diff({ node, vNode });
  flush(changeSet);
}

export function launch(islands: Island[]) {
  for (const island of islands) {
    const node = document.getElementById(island.id);
    console.log(node);
    if (node) {
      const vNode = <VComponent<Node>> AST.create<Node>(
        tag(island.node, null, []),
      );
      (<VElement<Node>> vNode.ast).props.id = island.id;
      sync(node, vNode);
    }
  }
}
