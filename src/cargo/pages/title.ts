import { head } from "./head.ts";

export function title(title: string) {
  head({ title: `<title>${title}</title>` });
}
