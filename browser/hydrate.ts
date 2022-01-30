import { RenderParams } from "./render.ts";
import { attach, ev, is } from "./events.ts";

export function h(
  p: RenderParams,
) {
  const { tag, children, ...at } = p.e;

  for (const k in at) {
    if (is(k)) {
      attach(p.p, ev(k), <() => void> at[k]);
    }
  }

  const e = p.p.querySelector(tag);
  if (e instanceof HTMLElement) {
    let i = 0;
    for (const child of children) {
      hc({
        i,
        p: e,
        e: child,
      });
      i++;
    }
  } else {
    throw new Error("Element not found in the DOM!");
  }
  console.log(e);
}

function hc(p: { i: number; p: HTMLElement; e: JSX.Node }) {
  console.log(p);
}
