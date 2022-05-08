/** @jsx tag */

import { tag } from "../parcel/__framework.ts";
import { Title } from "./Title.tsx";

export function Root(
  props: JSX.ElementProps,
): JSX.Element {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/assets/styles.css" />
        <link rel="icon" href="/assets/favicon.ico" />
        {(props.scripts as string[])?.map((script) => {
          return <script type="module" src={script}></script>;
        })}
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <Title />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
