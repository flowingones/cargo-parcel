import "./types.ts";

export interface ElementAttributes {
  [attribute: string]: unknown;
}

export function factory(
  tag: (props: JSX.ComponentProps) => JSX.Node,
  attributes: ElementAttributes,
  ...children: JSX.Node[] | JSX.Node[][]
) {
  if (typeof tag === "string") {
    return { tag, ...attributes, children: flatten(children) };
  }
  if (typeof tag === "function") {
    return tag({ ...attributes, children: flatten(children) });
  }
  return {};
}

function flatten(children: JSX.Node[] | JSX.Node[][]): JSX.Node[] {
  const flatten: JSX.Node[] = [];
  for (const child of children) {
    if (Array.isArray(child)) {
      flatten.push(...child);
    } else {
      flatten.push(child);
    }
  }
  return flatten;
}
