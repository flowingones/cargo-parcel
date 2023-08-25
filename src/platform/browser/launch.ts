/// <reference no-default-lib="true" />
/// <reference lib="DOM" />
/// <reference lib="deno.ns" />

import { SubscriberProps, Unsubscribe } from "../../state/mod.ts";
import { tag } from "../../tag.ts";
import {
  diff,
  dispatch,
  from,
  setComponentUpdater,
  VComponent,
  VElement,
  VNode,
} from "./deps.ts";

interface Island {
  class: string;
  node: JSX.Component;
  props: Record<string, unknown>;
}

function init(node: Node, vNode: VNode<Node>) {
  const changeSet = diff({ node, vNode });
  dispatch(changeSet);
}

export function launch(islands: Island[]) {
  setComponentUpdater((vComponent: VComponent<unknown>) => {
    return {
      update: () => {
        const vNode = <VComponent<Node>> from(vComponent);
        const changeSet = diff({
          vNode,
          previousVNode: <VComponent<Node>> vComponent,
        });
        vComponent.ast = vNode.ast;

        dispatch(changeSet);
      },
      unsubscribeCallback: (unsubscribe: Unsubscribe) => {
        vComponent.unsubs.push(unsubscribe);
      },
    };
  });

  for (const island of islands) {
    const node = document.querySelector(`.${island.class}`);
    if (node) {
      const vNode = <VComponent<Node>> from<Node>(
        tag(island.node, island.props, []),
      );
      typeof (<VElement<Node>> vNode.ast).props.class === "string"
        ? (<VElement<Node>> vNode.ast).props.class = `${
          (<VElement<Node>> vNode.ast).props.class
        } ${island.class}`
        : (<VElement<Node>> vNode.ast).props.class = island.class;
      init(node, vNode);
    }
  }
}
