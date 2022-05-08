/* @jsx tag */

import { tag } from "../deps.ts";
import { More } from "../components/More.tsx";

export const title = "Index";

export function index() {
  return (
    <div>
      Hello
      <button>
        Update
      </button>
      <More />
    </div>
  );
}
