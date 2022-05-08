import "./jsx/types.ts";
import type { Framework } from "./__framework.ts";
import type { State } from "./__state.ts";

let framework: Framework;

export function setFramework(instance: Framework) {
  if (!framework) {
    framework = instance;
  } else {
    console.error("Framework is already set!");
  }
}

export function title(title: string) {
  isSet();
  return framework.title(title);
}

export function onMount(fn: () => void) {
  isSet();
  return framework.onMount(fn);
}

export function onDestroy(fn: () => void) {
  isSet();
  return framework.onDestroy(fn);
}

export function state<T>(value: T): State<T> {
  isSet();
  return framework.state(value);
}

export function tag(
  tag: string | ((props: JSX.ElementProps) => JSX.Element),
  attributes: JSX.IntrinsicElements | null,
  ...children: JSX.Node[] | JSX.Node[][]
): JSX.Node {
  isSet();
  return framework.tag(tag, attributes, ...children);
}

function isSet() {
  if (!framework) {
    throw Error("Framework is undefined!");
  }
}
