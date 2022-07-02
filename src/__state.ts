import { cycle } from "./cycle.ts";
import { componentsCache } from "./__registry.ts";

export type State<T> = [
  value: T,
  setter: (value: T) => void,
];

const stateCache: State<unknown>[] = [];

export function state<T>(value: T): State<T> {
  if (stateCache.length) {
    return returnState();
  }
  if (componentsCache.toCreate.length) {
    return createsState(value);
  }
  throw Error("State could neither be initialized or returned");
}

function createsState<T>(value: T): State<T> {
  const newState: State<T> = [
    value,
    (newValue) => {
      stateCache.push(<State<unknown>> newState);
      newState[0] = newValue;
      cycle();
    },
  ];
  return newState;
}

function returnState<T>(): State<T> {
  return <State<T>> stateCache.shift();
}
