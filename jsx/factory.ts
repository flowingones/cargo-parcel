import "./types.ts";

export interface ElementAttributes {
  [attribute: string]: unknown;
}

export function factory(
  tag: (props: JSX.ComponentProps) => string | JSX.Element,
  attributes: ElementAttributes,
  ...children: string[] | JSX.Element[]
) {
  if (typeof tag === "string") {
    return { tag, ...attributes, children };
  }
  if (typeof tag === "function") {
    return tag({ ...attributes, children });
  }
  return {};
}
