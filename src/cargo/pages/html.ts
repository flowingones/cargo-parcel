const defaultAttributes = {
  lang: "en",
};
let htmlAttributesCache: Record<string, string> = defaultAttributes;

export function html(attributes: Record<string, string>) {
  htmlAttributesCache = { ...htmlAttributesCache, ...attributes };
}
export function htmlAttributes(): string[] {
  const attributes: string[] = [];
  for (const attribute in htmlAttributesCache) {
    attributes.push(`${attribute}="${htmlAttributesCache[attribute]}"`);
  }
  htmlAttributesCache = defaultAttributes;
  return attributes;
}
