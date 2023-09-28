import { tag } from "./tag.ts";

function jsx(
  type: string | JSX.Component,
  args: JSX.ElementProps,
  // TODO: Handle keys to track vnodes while updates
  _key: string,
) {
  const { children, ...props } = args;
  return tag(type, props as JSX.IntrinsicElements, children || []);
}

export { jsx, jsx as jsxs };
