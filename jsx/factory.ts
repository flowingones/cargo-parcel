import "./types.ts";

export interface ElementAttributes {
  [attribute: string]: unknown;
}

export function factory(
  tag: (props: JSX.ComponentProps) => string | JSX.Element,
  attributes: ElementAttributes,
  ...children: JSX.Element[] | JSX.Element[][]
) {
  if (typeof tag === "string") {
    return { tag, ...attributes, children: unwrap(children) };
  }
  if (typeof tag === "function") {
    return tag({ ...attributes, children: unwrap(children) });
  }
  return {};
}

function unwrap(children: JSX.Element[] | JSX.Element[][]): JSX.Element[] {
  if (Array.isArray(children[0])) {
    return children[0];
  }
  return <JSX.Element[]> children;
}
