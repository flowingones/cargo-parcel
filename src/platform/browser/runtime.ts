/// <reference no-default-lib="true" />
/// <reference lib="DOM" />
/// <reference lib="deno.ns" />

import { ast, VNode } from "../../ast.ts";
import { listener } from "../../cycle.ts";
import { diff } from "./diff/__diff.ts";
import { flush } from "./__dispatch.ts";

export let vnode: VNode | undefined;

export function render(root: Node, component: JSX.Element) {
  listener(() => {
    const previousVnode = vnode;
    vnode = ast(component);
    const changeSet = diff(root, vnode, previousVnode);
    console.log(changeSet);
    flush(changeSet);
  });
  vnode = ast(component);
  flush(diff(root, vnode));
}

export { Router } from "./router.ts";
