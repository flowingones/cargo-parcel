import "./types.ts";
import { componentsCache } from "./registry.ts";

export enum VComponentMode {
  NotCreated,
  Created,
}

export interface ElementProps {
  [key: string]: unknown;
  children?: VNode[];
}

export interface VNodeRef {
  type: "text" | "element" | "component";
  nodeRef?: unknown;
  eventsRefs: JSX.EventRef[];
  children?: VNode[];
}

export interface VElement extends VNodeRef {
  type: "element";
  tag: string;
  props: ElementProps;
}

export interface VText extends VNodeRef {
  type: "text";
  text: string | number;
}

export interface VComponent {
  type: "component";
  mode: VComponentMode;
  id: symbol;
  fn: (props: JSX.ElementProps) => JSX.Element;
  props: JSX.ElementProps;
  ast: VNode;
}

export type VNode = VComponent | VElement | VText | undefined | null;

function create(node: JSX.Node): VNode {
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
    type: "text",
    text,
    eventsRefs: [],
  };
}

function element(node: JSX.Element): VElement {
  const { tag, children, eventRefs, props } = node;

  return {
    type: "element",
    tag: <string> tag,
    props: <ElementProps> props,
    eventsRefs: eventRefs,
    children: children?.map((child) => create(child)),
  };
}

function updateElement(node: JSX.Element, vNode: VElement): VElement {
  const { tag, children, eventRefs, props } = node;

  return {
    type: "element",
    tag: <string> tag,
    props: <ElementProps> props,
    eventsRefs: eventRefs,
    children: children?.map((child, i) => {
      return track(child, vNode.children ? vNode.children[i] : undefined);
    }),
  };
}

function component(node: JSX.Element | VComponent): VNode {
  if ("fn" in node && typeof node.fn === "function") {
    return updateComponent(node);
  }
  return createComponent(<JSX.Element> node);
}

function createComponent(node: JSX.Element) {
  if (typeof node.tag !== "function") {
    throw new Error(
      "Component could not be initialized because tag is not a function",
    );
  }

  const { tag, props, children } = node;

  props.children = children;

  const component: VComponent = {
    type: "component",
    id: Symbol("Component"),
    mode: VComponentMode.NotCreated,
    fn: tag,
    ast: undefined,
    props,
  };

  componentsCache.toCreate.push(component);
  component.ast = create(component.fn(props));
  component.mode = VComponentMode.Created;
  componentsCache.toCreate.shift();

  return component;
}

function updateComponent(vComponent: VComponent) {
  const { id, mode, fn, ast, props } = vComponent;

  const updatedVComponent: VComponent = {
    type: "component",
    id,
    mode,
    fn,
    ast: undefined,
    props,
  };

  componentsCache.toCreate.push(updatedVComponent);
  const node = fn(props);
  componentsCache.toCreate.shift();

  vComponent.ast = track(node, ast);
  return vComponent;
}

function track(node: JSX.Node, vNode: VNode): VNode {
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

function update(vNode: VNode) {
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
