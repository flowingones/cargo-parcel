/** @jsx tag */

import { tag } from "../parcel/__framework.ts";

const page = {
  title: "",
};

export function title(title: string) {
  page.title = title;
}

export function Title() {
  return <title>{page.title}</title>;
}
