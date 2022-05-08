import { bootstrap, Root, StaticPage } from "./deps.ts";

await StaticPage(
  "pages/index.tsx",
  Root,
);

StaticPage(
  "pages/home.tsx",
  Root,
);

(await bootstrap()).run();
