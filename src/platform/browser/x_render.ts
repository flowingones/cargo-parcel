import { ast, VElement, VNode } from "../../ast.ts";

import { options } from "./__options.ts";

import { attach } from "./events.ts";

export function render(
  component: JSX.Element,
  root: HTMLElement,
) {
  if (options.domRoot) {
    options.domRoot = root;
  }
  if (options.component) {
    options.component = component;
  }

  const tree = <VElement> ast(component);
  options.ast = tree;
  const node = root.childNodes[0];

  link(node, tree);
}

function link(node: Node, vnode: VNode) {
  if (!vnode) return;

  if ("tag" in vnode) {
    if (node instanceof HTMLElement) {
      for (const eventRef of vnode.eventsRefs) {
        attach(
          node,
          eventRef.name,
          <() => void> eventRef.listener,
        );
      }

      let count = 0;
      collect(vnode.props.children)?.forEach((child) => {
        link(node.childNodes.item(count), child);
        count++;
      });

      vnode.nodeRef = node;
      return;
    }
    throw new Error(
      "Element could not be hydrated. Because the type was a mismatch!",
    );
  }

  if ("text" in vnode) {
    if (node instanceof Text) {
      vnode.nodeRef = node;
      return;
    }
    throw new Error(
      "Text could not be hydrated. Because the type was a mismatch!",
    );
  }
}

function collect(vnodes?: VNode[]): VNode[] | undefined {
  return vnodes?.filter((vnode, index, source) => {
    if (!vnode) return false;
    if ("tag" in vnode) return true;

    const nextVNode = source[index + 1];

    if (!nextVNode) {
      return true;
    }

    if ("text" in vnode && "tag" in nextVNode) {
      return true;
    }

    if ("text" in vnode && "text" in nextVNode) {
      nextVNode.text = `${vnode.text}${nextVNode.text}`;
      nextVNode.nodeRef = vnode.nodeRef;
      return false;
    }

    return false;
  });
}
