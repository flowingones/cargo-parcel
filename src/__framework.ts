import "./jsx/types.ts";

import type { State } from "./__state.ts";

export interface Framework {
  tag(
    tag: string | ((props: JSX.ElementProps) => JSX.Element),
    attributes: JSX.IntrinsicElements | null,
    ...children: JSX.Node[] | JSX.Node[][]
  ): JSX.Element;
  onMount(fn: () => void): void;
  onDestroy(fn: () => void): void;
  state<T>(value: T): State<T>;
}

export { tag } from "./tag.ts";
export { onDestroy, onMount } from "./__hooks.ts";
export { state } from "./__state.ts";
