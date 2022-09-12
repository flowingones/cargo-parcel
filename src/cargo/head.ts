export interface Head {
  title?: string;
  base?: string;
  link?: string[];
  meta?: string[];
  script?: string[];
  noscript?: string[];
  style?: string[];
}

let cache: Head = {};

export function head(props: Head): void {
  cache = { ...cache, ...props };
}

export function getHead(): Head {
  const { ...headTags } = cache;
  cache = {};
  return headTags;
}
