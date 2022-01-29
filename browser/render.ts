/// <reference lib="DOM" />

export interface RenderParams {
  e: JSX.Element;
  p: HTMLElement;
}

const d: Document = document;

export function h(
  p: RenderParams,
) {
  const e = p.p.querySelector(p.e.tag);
  console.log(e);
}

export function r(
  p: RenderParams,
): HTMLElement {
  const { tag, children, ...a } = p.e;

  const n: HTMLElement = d.createElement(tag);

  for (const [k, v] of Object.entries(a)) {
    // TODO: Handle different types and actions
    setAttribute(n, k, <string> v);
  }

  for (const c of children) {
    if (typeof c === "string") {
      setText(n, c);
    } else if (c?.tag) {
      appendChild(n, r({ e: c, p: n }));
    }
  }

  appendChild(p.p, n);

  return n;
}

function setAttribute(n: HTMLElement, key: string, value: string) {
  n.setAttribute(key, value);
}

function setText(n: Node, t: string) {
  n.textContent = t;
}

function appendChild(n: Node, c: Node) {
  n.appendChild(c);
}
