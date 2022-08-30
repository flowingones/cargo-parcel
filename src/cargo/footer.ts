export interface Footer {
  script?: string[];
  noscript?: string[];
}

let cache: Footer = {};

export function footer(props: Footer): void {
  cache = { ...cache, ...props };
}

export function getFooter(): Footer {
  const { ...footerTags } = cache;
  cache = {};
  return footerTags;
}
