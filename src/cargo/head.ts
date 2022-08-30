export interface Head {
  title?: string;
  base?: string;
  link?: string[];
  meta?: string[];
  script?: string[];
  noscript?: string[];
  style?: string[];
}

let headCache: Head = {};

export function head(props: Head): void {
  headCache = { ...headCache, ...props };
}

export function getHead(): Head {
  const { ...headTags } = headCache;
  headCache = {};
  return headTags;
}
