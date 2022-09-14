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
  class: string;
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
  console.log(islands);
  for (const island of islands) {
    const node = document.querySelector(`.${island.class}`);
    console.log(node);
    if (node) {
      const vNode = <VComponent<Node>> AST.create<Node>(
        tag(island.node, null, []),
      );
      typeof (<VElement<Node>> vNode.ast).props.class === "string"
        ? (<VElement<Node>> vNode.ast).props.class = `${
          (<VElement<Node>> vNode.ast).props.class
        } ${island.class}`
        : (<VElement<Node>> vNode.ast).props.class = island.class;
      sync(node, vNode);
    }
  }
}
