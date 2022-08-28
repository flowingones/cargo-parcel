/// <reference no-default-lib="true" />
/// <reference lib="DOM" />
/// <reference lib="deno.ns" />

import { AST, diff, flush, listener, VNode } from "./deps.ts";

export let vNode: VNode<Node> | undefined;

export function bootstrap(root: Node, component: JSX.Element) {
  // Register the listener to trigger re-rendering
  listener(() => {
    const previousVNode = vNode;
    vNode = AST.update(vNode);
    const changeSet = diff({ vNode, previousVNode });
    flush(changeSet);
  });
  vNode = AST.create(component);
  const changeSet = diff({ node: root, vNode });
  flush(changeSet);
}
