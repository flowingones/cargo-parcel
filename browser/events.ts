/// <reference lib="DOM" />

export function is(a: string) {
  const p = /on-([a-z]+)/;
  return p.test(a);
}

export function ev(id: string): string {
  return id.replace("on-", "");
}

export function attach(e: HTMLElement, ev: string, l: () => void): void {
  if (typeof l === "function") {
    e.addEventListener(ev, l);
  } else {
    throw new Error("Listener is not of type function!");
  }
}
