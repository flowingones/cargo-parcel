import { bootstrap, Root, StaticPage } from "./deps.ts";

import { home } from "./pages/home.tsx";

StaticPage(
  {
    path: "index",
    title: "Home",
    component: home,
  },
  Root,
);

(await bootstrap()).run();
