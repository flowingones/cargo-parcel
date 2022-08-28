import "./types.ts";
import { componentsCache } from "./registry.ts";

export enum VComponentMode {
  NotCreated,
  Created,
}

export interface ElementProps<T> {
  [key: string]: unknown;
  children?: VNode<T>[];
}

export interface VNodeRef<T> {
  type: "text" | "element";
  nodeRef?: T;
  eventsRefs: JSX.EventRef[];
  children?: VNode<T>[];
}

export interface VElement<T> extends VNodeRef<T> {
  type: "element";
  tag: string;
  props: ElementProps<T>;
}

export interface VText<T> extends VNodeRef<T> {
  type: "text";
  text: string;
}

export interface VComponent<T> {
  type: "component";
  mode: VComponentMode;
  id: symbol;
  fn: (props: JSX.ElementProps) => JSX.Element;
  props: JSX.ElementProps;
  ast: VNode<T>;
}

export type VNode<T> =
  | VComponent<T>
  | VElement<T>
  | VText<T>
  | undefined
  | null;

function create<T>(node: JSX.Node): VNode<T> {
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

function text<T>(text: string): VText<T> {
  return {
    type: "text",
    text: `${text}`,
    eventsRefs: [],
  };
}

function element<T>(node: JSX.Element): VElement<T> {
  const { tag, children, eventRefs, props, ...rest } = node;

  return {
    type: "element",
    tag: <string> tag,
    props: <ElementProps<T>> props,
    eventsRefs: eventRefs,
    children: children?.map((child) => {
      if (typeof child === "number") {
        child = `${child}`;
      }
      return create(child);
    }),
    ...rest,
  };
}

function updateElement<T>(node: JSX.Element, vNode: VElement<T>): VElement<T> {
  const { tag, children, eventRefs, props } = node;

  return {
    type: "element",
    tag: <string> tag,
    props: <ElementProps<T>> props,
    eventsRefs: eventRefs,
    children: children?.map((child, i) => {
      if (typeof child === "number") {
        child = `${child}`;
      }
      return track(child, vNode.children ? vNode.children[i] : undefined);
    }),
  };
}

function component<T>(node: JSX.Element | VComponent<T>): VNode<T> {
  if ("fn" in node && typeof node.fn === "function") {
    return updateComponent(node);
  }
  return createComponent(<JSX.Element> node);
}

function createComponent<T>(node: JSX.Element) {
  if (typeof node.tag !== "function") {
    throw new Error(
      "Component is not a function",
    );
  }

  const { tag, props, children } = node;

  props.children = children;

  const component: VComponent<T> = {
    type: "component",
    ast: undefined,
    id: Symbol("Component"),
    mode: VComponentMode.NotCreated,
    fn: tag,
    props,
  };

  componentsCache.toCreate.push(component);
  component.ast = create(component.fn(props));
  component.mode = VComponentMode.Created;
  componentsCache.toCreate.shift();

  return component;
}

function updateComponent<T>(vComponent: VComponent<T>) {
  const { type, id, mode, fn, ast, props, ...rest } = vComponent;

  const updatedVComponent: VComponent<T> = {
    type,
    id,
    mode,
    fn,
    ast: undefined,
    props,
    ...rest,
  };

  componentsCache.toCreate.push(updatedVComponent);
  const node = fn(props);
  componentsCache.toCreate.shift();

  updatedVComponent.ast = track(node, ast);
  return updatedVComponent;
}

function track<T>(node: JSX.Node, vNode: VNode<T>): VNode<T> {
  if (!node) return;

  if (typeof node === "string" || typeof node === "number") {
    return text(node);
  }

  if (typeof node.tag === "string") {
    if (vNode?.type === "element" && node.tag === vNode.tag) {
      return updateElement(node, vNode);
    }
    return element(node);
  }

  if (typeof node.tag === "function") {
    if (vNode?.type === "component" && (vNode.fn === node.tag)) {
      const { children, props } = node;
      props.children = children;
      vNode.props = props;
      return component(vNode);
    }
    return component(node);
  }
}

function update<T>(vNode: VNode<T>) {
  if (!vNode) {
    return;
  }
  if (vNode.type === "component") {
    return component(vNode);
  }
  throw Error(`VNode with type of "${vNode.type}" is not supported.`);
}

export const AST = {
  create,
  update,
};
