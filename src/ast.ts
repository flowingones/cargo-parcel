import "./types.ts";

export const scope: VComponent<unknown>[] = [];

export enum VMode {
  NotCreated,
  Created,
}

export enum VType {
  TEXT,
  ELEMENT,
  COMPONENT,
}

export interface ElementProps<T> {
  [key: string]: unknown;
  children?: VNode<T>[];
}

export interface VBase {
  type: VType;
  hooks?: VHooks;
}

export interface VHooks {
  onMount?: ((() => () => void) | (() => void))[];
  onDestroy?: (() => void)[];
}

export interface VNodeRef<T> extends VBase {
  nodeRef?: T;
  eventRefs: JSX.EventRef[];
  children?: VNode<T>[];
}

export interface VElement<T> extends VNodeRef<T> {
  type: VType.ELEMENT;
  tag: string;
  props: ElementProps<T>;
}

export interface VText<T> extends VNodeRef<T> {
  type: VType.TEXT;
  text: string;
}

export interface VComponent<T> extends VBase {
  type: VType.COMPONENT;
  mode: VMode;
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

function update<T>(vNode: VNode<T>) {
  if (!vNode) {
    return;
  }
  if (vNode.type === VType.COMPONENT) {
    return component(vNode);
  }
  throw Error(`VNode with type of "${vNode.type}" is not supported.`);
}

function text<T>(text: string): VText<T> {
  return {
    type: VType.TEXT,
    text: `${text}`,
    eventRefs: [],
  };
}

function element<T>(node: JSX.Element, vNode?: VElement<T>): VElement<T> {
  const { tag, children, eventRefs, props, ...rest } = node;

  return {
    type: VType.ELEMENT,
    tag: <string> tag,
    props: <ElementProps<T>> props,
    eventRefs: eventRefs,
    children: children?.map((child, i) => {
      if (typeof child === "number") {
        child = `${child}`;
      }
      return vNode
        ? track(child, vNode.children ? vNode.children[i] : undefined)
        : create(child);
    }),
    ...rest,
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
    type: VType.COMPONENT,
    ast: undefined,
    id: Symbol("Parcel Component ID"),
    mode: VMode.NotCreated,
    fn: tag,
    props,
  };

  scope.push(component);
  component.ast = create(component.fn(props));
  component.mode = VMode.Created;
  scope.shift();

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

  scope.push(updatedVComponent);
  const node = fn(props);
  scope.shift();

  updatedVComponent.ast = track(node, ast);
  return updatedVComponent;
}

function track<T>(node: JSX.Node, vNode: VNode<T>): VNode<T> {
  if (!node) return;

  if (typeof node === "string" || typeof node === "number") {
    return text(node);
  }

  if (typeof node.tag === "string") {
    if (vNode?.type === VType.ELEMENT && node.tag === vNode.tag) {
      return element(node, vNode);
    }
    return element(node);
  }

  if (typeof node.tag === "function") {
    if (vNode?.type === VType.COMPONENT && vNode.fn === node.tag) {
      const { children, props } = node;
      props.children = children;
      vNode.props = props;
      return component(vNode);
    }
    return component(node);
  }
}

export const AST = {
  create,
  update,
};
