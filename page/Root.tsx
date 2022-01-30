/** @jsx factory */

import { factory } from "../mod.ts";
import { Pages } from "../page/pages.ts";

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
        {props.styles?.map((style) => {
          return <link rel="stylesheet" href={style} />;
        })}
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to your Cargo Website!</title>
      </head>
      <body>{props.children}</body>
      <script type="module">
        {`import { P, R } from "./runtime.js";
        const p = new P({
          root: document.body,
          routes: ${Pages.stringify()}
        });
        p.h(R.current())`}
      </script>
    </html>
  );
}
