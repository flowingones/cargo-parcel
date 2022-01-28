import { bootstrap } from "https://deno.land/x/cargo@0.1.21/mod.ts";

import { autoloadPages } from "../http/autoload.ts";
import { Root } from "../mod.ts";

await autoloadPages("pages", Root);

(await bootstrap()).run();
