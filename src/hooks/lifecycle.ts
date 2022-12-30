import { scope } from "./deps.ts";

export function onMount(fn: () => () => void) {
  scope[scope.length - 1].hooks = {
    onMount: [fn],
  };
}

export function onDestroy(fn: () => void) {
  scope[scope.length - 1].hooks = {
    onDestroy: [fn],
  };
}
