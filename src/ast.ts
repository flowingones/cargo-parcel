import {
  clearSubscriber,
  setSubscriber,
  type Subscriber,
  Unsubscribe,
} from "./state/mod.ts";
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

export type VState = JSX.StateLike;

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
  text: string | VState;
}

export interface VComponent<T> extends VBase {
  type: VType.COMPONENT;
  mode: VMode;
  id: symbol;
  fn: (props: JSX.ElementProps) => JSX.Element;
  props: JSX.ElementProps;
  ast: VNode<T>;
  unsubs: Unsubscribe[];
}

export type VNode<T> =
  | VComponent<T>
  | VElement<T>
  | VText<T>
  | undefined
  | null;

type VComponentUpdater<T, V> = (component: VComponent<T>) => Subscriber<V>;

let vComponentUpdater: VComponentUpdater<unknown, unknown> | undefined;

export function setComponentUpdater(
  updater: VComponentUpdater<unknown, unknown>,
): void {
  vComponentUpdater = updater;
}

export function from<T>(node: JSX.Node | VComponent<T>): VNode<T> {
  if (node == null) return;

  if (isTextNode(node)) {
    return vText(node);
  }

  if ("tag" in node && typeof node.tag === "string") {
    return vElement(node);
  }

  if (("tag" in node && typeof node.tag === "function")) {
    return createVComponent(node);
  }

  if (
    ("fn" in node && typeof node.fn === "function")
  ) {
    return updateVComponent(node);
  }
}

export function update<T>(vNode: VComponent<T>) {
  return from(vNode);
}

function vText<T>(node: string | number | JSX.StateLike): VText<T> {
  return {
    type: VType.TEXT,
    text: (typeof node === "object" && "get" in node) ? node : `${node}`,
    eventRefs: [],
  };
}

function vElement<T>(node: JSX.Element, vNode?: VElement<T>): VElement<T> {
  const { tag, children, eventRefs, props, ...rest } = node;

  return {
    type: VType.ELEMENT,
    tag: <string> tag,
    props: <ElementProps<T>> props,
    eventRefs: eventRefs,
    children: children?.map((child, i) => {
      return vNode
        ? track(child, vNode.children ? vNode.children[i] : undefined)
        : from(child);
    }),
    ...rest,
  };
}

function createVComponent<T>(node: JSX.Element) {
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
    id: Symbol(),
    mode: VMode.NotCreated,
    fn: tag,
    unsubs: [],
    props,
  };

  scope.push(component);
  setSubscriber(vComponentUpdater ? vComponentUpdater(component) : undefined);
  component.ast = from(component.fn(props));
  component.mode = VMode.Created;
  clearSubscriber();
  scope.shift();

  return component;
}

function updateVComponent<T>(vComponent: VComponent<T>) {
  const { type, id, mode, fn, ast, props, unsubs, ...rest } = vComponent;

  const updatedVComponent: VComponent<T> = {
    type,
    id,
    mode,
    fn,
    ast: undefined,
    props,
    unsubs: [],
    ...rest,
  };

  scope.push(updatedVComponent);
  unsubs.forEach((unsub) => unsub());
  setSubscriber(
    vComponentUpdater ? vComponentUpdater(updatedVComponent) : undefined,
  );
  const node = fn(props);
  clearSubscriber();
  scope.shift();

  updatedVComponent.ast = track(node, ast);
  return updatedVComponent;
}

function track<T>(node: JSX.Node, vNode: VNode<T>): VNode<T> {
  if (node == null) return;

  if (isTextNode(node)) {
    return vText(node);
  }

  if (typeof node.tag === "string") {
    if (vNode?.type === VType.ELEMENT && node.tag === vNode.tag) {
      return vElement(node, vNode);
    }
    return vElement(node);
  }

  if (typeof node.tag === "function") {
    if (vNode?.type === VType.COMPONENT && vNode.fn === node.tag) {
      const { children, props } = node;
      props.children = children;
      vNode.props = props;
      return updateVComponent(vNode);
    }
    return createVComponent(node);
  }
}

// TODO: Move type-guard to appropriate location
function isTextNode(
  value: unknown,
): value is string | number | JSX.StateLike {
  return (
    value != null && (
      typeof value === "string" ||
      (Number.isFinite(value)) ||
      (typeof value === "object" && "get" in value)
    )
  );
}
