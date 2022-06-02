import { getStyleTag, setup as twSetup, virtualSheet } from "./deps.ts";

const stylesheet = virtualSheet();

function setup(options?: any): void {
  options = { sheet: stylesheet, ...options };
  twSetup(options);
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
  setup,
  reset,
  sheet,
  styleTag,
};
