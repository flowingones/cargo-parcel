import "./types.ts";
import { componentsCache } from "./__registry.ts";

export interface ElementProps {
  [key: string]: unknown;
  children?: VNode[];
}

export interface VNodeRef {
  nodeRef?: unknown;
  eventsRefs: JSX.EventRef[];
  children?: VNode[];
}

export interface VElement extends VNodeRef {
  tag: string;
  props: ElementProps;
}

export interface VText extends VNodeRef {
  text: string | number;
}

export interface VComponent {
  id: symbol;
  fn: (props: JSX.ElementProps) => JSX.Element;
  props: JSX.ElementProps;
  ast: VNode;
}

export type VNode = VComponent | VElement | VText | undefined | null;

export function ast(node: JSX.Node): VNode {
  if (!node) return;

  if (typeof node === "string" || typeof node === "number") {
    return text(node);
  }

  if (typeof node.tag === "string") {
    return element(node);
  }

  if (typeof node.tag === "function") {
    return component(node);
  }
}

function text(text: string): VText {
  return {
    text,
    eventsRefs: [],
  };
}

function element(node: JSX.Element): VElement {
  const { tag, children, eventRefs, props } = node;

  const vnode = {
    tag: <string> tag,
    props: <ElementProps> props,
    eventsRefs: eventRefs,
    children: children?.map((child) => ast(child)),
  };

  return vnode;
}

function component(node: JSX.Element): VNode {
  if (typeof node.tag !== "function") {
    throw new Error(
      "Component could not be initialized because tag is not a function",
    );
  }

  const { tag, props, children } = node;

  props.children = children;

  const component: VComponent = {
    id: Symbol("Component"),
    fn: tag,
    ast: undefined,
    props,
  };

  componentsCache.toCreate.push(component);
  component.ast = ast(component.fn(props));
  componentsCache.toCreate.shift();

  return component;
}
