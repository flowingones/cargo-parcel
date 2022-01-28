/** @jsx factory */

import { factory } from "../mod.ts";

interface RootProps extends JSX.ComponentProps {
  scripts?: string[];
  styles?: string[];
}

export function Root(props: RootProps): JSX.Element {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/assets/styles.css" />
        <link rel="icon" href="/assets/favicon.ico" />
        {props.scripts?.map((script) => {
          return <script type="module" src={script}></script>;
        })}
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to your Cargo Website!</title>
      </head>
      <body>{props.children}</body>
    </html>
  );
}
