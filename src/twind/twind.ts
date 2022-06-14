import { setup } from "./mod.ts";
import { virtualSheet } from "./sheets/mod.ts";

export const sheet = virtualSheet();

export function setupTwind(config: any): () => void {
  return () => {
    setup({ sheet, ...config });
  };
}
