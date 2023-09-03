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
    children: flatten(children),
  };
}

function flatten(nodes: JSX.Node[] | JSX.Node[][]): JSX.Node[] {
  const children: JSX.Node[] = [];
  for (const node of nodes) {
    if (Array.isArray(node)) {
      children.push(...flatten(node));
    } else {
      children.push(<JSX.Node> node);
    }
  }
  return children;
}
