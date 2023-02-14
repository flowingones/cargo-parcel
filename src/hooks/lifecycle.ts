import { scope, VMode } from "./deps.ts";

export function onMount(fn: (() => () => void) | (() => void)) {
  const vComponent = scope[scope.length - 1];

  if (vComponent.mode === VMode.NotCreated) {
    if (!vComponent.hooks) {
      vComponent.hooks = {};
    }

    vComponent.hooks.onMount = Array.isArray(vComponent.hooks.onMount)
      ? [...vComponent.hooks.onMount, fn]
      : [fn];
  }
}

export function onDestroy(fn: () => void) {
  const vComponent = scope[scope.length - 1];

  if (vComponent.mode === VMode.NotCreated) {
    if (!vComponent.hooks) {
      vComponent.hooks = {};
    }

    vComponent.hooks.onDestroy = Array.isArray(vComponent.hooks.onDestroy)
      ? [...vComponent.hooks.onDestroy, fn]
      : [fn];
  }
}
