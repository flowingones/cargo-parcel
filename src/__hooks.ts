import { componentsCache } from "./__registry.ts";

export interface Hook {
  fn: () => void;
}

export interface Hooks {
  onMount: Hook;
  onDestroy: Hook;
}

export function onMount(fn: () => void) {
  if (componentsCache.toCreate[componentsCache.toCreate.length - 1]) {
    componentsCache.toCreate[componentsCache.toCreate.length - 1].hooks
      .onMount = { fn };
  }
}

export function onDestroy(fn: () => void) {
  if (componentsCache.toCreate[componentsCache.toCreate.length - 1]) {
    componentsCache.toCreate[componentsCache.toCreate.length - 1].hooks
      .onDestroy = { fn };
  }
}
