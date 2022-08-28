import { head } from "./mod.ts";

export function title(title: string) {
  head({ title: `<title>${title}</title>` });
}
