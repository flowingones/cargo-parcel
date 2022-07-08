import { componentsCache, VComponent } from "./deps.ts";

interface VStateComponent<T> extends VComponent {
  state?: State<T>[];
}

export type State<T> = [
  value: T,
  setter: (value: T) => void,
  componentId: symbol,
];

const stateCache: State<any>[] = [];

export function state<T>(value: T): State<T> {
  if (!componentsCache.toCreate.length) {
    throw Error("State could neither be created nor returned!");
  }

  const vComponent: VStateComponent<T> =
    componentsCache.toCreate[componentsCache.toCreate.length - 1];

  // If state is left in the current VComponent scope return it.
  if (stateCache.length) {
    if (stateCache[stateCache.length - 1][2] === vComponent.id) {
      const current: State<T> = returnState();
      vComponent.state?.push(current);
      return current;
    }
    // If VComponent has different id reset the state cache
    stateCache.length = 0;
  }

  // If VComponent is created and has state return VComponent state
  if (vComponent.mode === 1 && vComponent.state?.length) {
    stateCache.push(...vComponent.state);
    vComponent.state = [];
    const current: State<T> = returnState();
    vComponent.state.push(current);
    return current;
  }

  // Return new state
  return createsState(value, vComponent);
}

function createsState<T>(value: T, vComponent: VStateComponent<T>): State<T> {
  // Create new state with reference to vComponent
  const newState: State<T> = [
    value,
    (newValue) => {
      if (Array.isArray(vComponent.state)) {
        stateCache.push(...vComponent.state);
        vComponent.state = [];
        newState[0] = newValue;
      }
    },
    vComponent.id,
  ];

  // Add state to the component
  if (Array.isArray(vComponent.state)) {
    vComponent.state.push(newState);
  } else {
    vComponent.state = [newState];
  }
  return newState;
}

function returnState<T>(): State<T> {
  return <State<T>> stateCache.shift();
}