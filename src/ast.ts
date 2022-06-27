import "./types.ts";
import { componentsCache } from "./__registry.ts";
import { eventName, isEventName } from "./event.ts";

import type { Hook } from "./__hooks.ts";
import type { State } from "./__state.ts";

const components: VComponent[] = [];

export interface ElementProps {
  [key: string]: unknown;
  children?: VNode[];
}

export interface NodeRef {
  nodeRef?: unknown;
  eventsRefs: JSX.EventRef[];
  componentRef: symbol;
}

export interface VElement extends NodeRef {
  tag: string;
  props: ElementProps;
}

export interface VText extends NodeRef {
  text: string | number;
}

export interface VComponent {
  id: symbol;
  fn: (props: JSX.ElementProps) => JSX.Element;
  props: JSX.ElementProps;
  hooks: {
    onMount?: Hook;
    onDestroy?: Hook;
  };
  ast?: JSX.Element;
  state: State<unknown>[];
}

export type VNode = VComponent | VElement | VText | undefined | null;

export type ChildNode = VElement | VComponent | string;

export function ast(node: JSX.Node, scope?: symbol): VNode {
  if (!node) return;

  if (!scope) {
    scope = Symbol("Root scope");
  }

  if (typeof node === "string" || typeof node === "number") {
    return {
      text: node,
      componentRef: scope,
      eventsRefs: [],
    };
  }

  if (typeof node.tag === "string") {
    return element(node, scope);
  }

  if (typeof node.tag === "function") {
    return component(node);
  }
}

function element(node: JSX.Element, scope: symbol): VElement {
  const { tag } = node;
  const { ...props } = node.props;
  const events: JSX.EventRef[] = [];
  (<ElementProps> props).children = props.children?.map((child) =>
    ast(child, scope)
  );

  for (const prop in props) {
    if (isEventName(prop)) {
      events.push({
        name: eventName(prop),
        listener: <() => void> props[prop],
      });
      delete props[prop];
    }
  }

  const vnode = {
    tag: <string> tag,
    props: <ElementProps> props,
    eventsRefs: events,
    componentRef: scope,
  };

  return vnode;
}

function component(node: JSX.Element): VNode {
  if (typeof node.tag !== "function") {
    throw new Error(
      "Component could not be initialized because tag is not a function",
    );
  }

  const { tag, props } = node;

  const component: VComponent = {
    id: Symbol("Component"),
    fn: tag,
    props,
    hooks: {},
    state: [],
  };

  componentsCache.toCreate.push(component);
  component.ast = component.fn(component.props);
  componentsCache.toCreate.shift();

  components.push(component);

  return ast(component.ast, component.id);
}
