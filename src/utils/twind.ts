import { getStyleTag, setup, virtualSheet } from "../../deps.ts";

const stylesheet = virtualSheet();

function init(): void {
  setup({ sheet: stylesheet });
}
function reset(): void {
  // @ts-ignore
  stylesheet.reset();
}
function sheet() {
  return stylesheet;
}

function styleTag(sheet: any) {
  return getStyleTag(sheet);
}

export const Twind = {
  init,
  reset,
  sheet,
  styleTag,
};