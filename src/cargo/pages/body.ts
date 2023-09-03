let bodyAttributesCache: Record<string, string> = {};
export function body(attributes: Record<string, string>) {
  bodyAttributesCache = { ...bodyAttributesCache, ...attributes };
}
export function bodyAttributes(): string[] {
  const attributes: string[] = [];
  for (const attribute in bodyAttributesCache) {
    attributes.push(`${attribute}="${bodyAttributesCache[attribute]}"`);
  }
  bodyAttributesCache = {};
  return attributes;
}
