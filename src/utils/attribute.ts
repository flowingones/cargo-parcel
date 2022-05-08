import { ElementAttributes } from "../jsx/factory.ts";

export function applyIdClass(
  attributes: ElementAttributes,
  sequence: string,
): ElementAttributes {
  const { ...copy } = attributes;
  for (const key in copy) {
    if (key === "class") {
      copy[key] += ` ${sequence}`;
      return copy;
    }
  }
  copy.class = sequence;
  return copy;
}

export function classAppliable(tag: string): boolean {
  return !["meta", "link", "script", "head", "title"].includes(tag);
}
