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
    children: collectTextNodes(flatten(children)),
  };
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

function collectTextNodes(nodes?: JSX.Node[]): JSX.Node[] {
  return nodes
    //Remove all undefined child nodes.
    ?.filter((node) => typeof node !== "undefined")
    .filter(
      (node, index, source) => {
        if (typeof node === "undefined" || node === null) return false;

        if (
          typeof (<JSX.Element> node).tag === "string" ||
          typeof (<JSX.Element> node).tag === "function"
        ) {
          return true;
        }

        if (typeof source[index + 1] === "undefined") {
          return true;
        }

        if (
          typeof source[index + 1] !== "string" &&
          typeof source[index + 1] !== "number"
        ) {
          return true;
        }

        source[index + 1] = `${node}${source[index + 1]}`;
        return false;
      },
    ) || [];
}
