import { State } from "../state/state.ts";

import { scope, VComponent, VMode } from "./deps.ts";

interface VComponentWithState<T> extends VComponent<unknown> {
  state?: State<T>[];
}

interface StateScope<T> {
  componentId: symbol;
  state: State<T>;
}

const statesCache: StateScope<unknown>[] = [];

export function $<T>(value: T) {
  if (!scope.length) {
    return new State(value);
  }

  const vComponent: VComponentWithState<T> = scope[scope.length - 1];

  // If state is left in the current VComponent return it.
  if (statesCache.length) {
    if (statesCache[statesCache.length - 1].componentId === vComponent.id) {
      const current = <StateScope<T>> statesCache.shift();
      vComponent.state?.push(current.state);
      return current.state;
    }
    // If VComponent has different id reset the state cache
    statesCache.length = 0;
  }

  // If VComponent is created and has state return VComponent state
  if (vComponent.mode === VMode.Created && vComponent.state?.length) {
    statesCache.push(
      ...<StateScope<unknown>[]> vComponent.state.map((state) => ({
        componentId: vComponent.id,
        state,
      })),
    );
    vComponent.state = [];
    const current: StateScope<T> = <StateScope<T>> statesCache.shift();
    vComponent.state.push(current.state);
    return current.state;
  }

  const state = new State(value);
  if (Array.isArray(vComponent.state)) {
    vComponent.state.push(state);
  } else {
    vComponent.state = [state];
  }
  return state;
}
