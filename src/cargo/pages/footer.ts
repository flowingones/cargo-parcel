import { merge } from "./head.ts";

export interface Footer extends Record<string, string | string[] | undefined> {
  script?: string[];
  noscript?: string[];
}

let cache: Footer = {};

export function footer(props: Footer): void {
  cache = merge(props, cache);
}

export function getFooter(): Footer {
  const { ...footerTags } = cache;
  cache = {};
  return footerTags;
}
