/* @jsx tag */

import { tag } from "../../parcel/__framework.ts";
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
