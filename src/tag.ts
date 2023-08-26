import "./types.ts";

import { eventName, isEventName } from "./event.ts";

export function tag(
  tag: string | ((props: JSX.ElementProps) => JSX.Element),
  attributes: JSX.IntrinsicElements | null,
  ...children: JSX.Node[] | JSX.Node[][]
): JSX.Element {
  const { ...props }: JSX.ElementProps = attributes || {};

  const eventRefs: JSX.EventRef[] = [];

  for (const prop in props) {
    if (isEventName(prop)) {
      eventRefs.push({
        name: eventName(prop),
        listener: <() => void> props[prop],
      });
      delete props[prop];
    }
  }

  return {
    tag,
    props,
    eventRefs,
    children: flattenAndFilter(children),
  };
}

function flattenAndFilter(children: unknown[] | unknown[][]): JSX.Node[] {
  const flatten: JSX.Node[] = [];
  for (const child of children) {
    if (Array.isArray(child)) {
      flatten.push(...child);
    } else {
      // map children with true to string
      if (child === true) {
        flatten.push("true");
        continue;
      }
      // skip children with value of undefined, null or false
      if (child == null || child === false) {
        continue;
      }
      flatten.push(<JSX.Node> child);
    }
  }
  return flatten;
}
