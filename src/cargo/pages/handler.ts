import {
  type Middleware,
  walkthroughAndHandle,
} from "cargo/middleware/middleware.ts";
import { pageFrom } from "./page.ts";
import type {
  AfterRenderTaskContext,
  PluginDefintions,
  PluginTaskContext,
} from "../plugins/plugins.ts";
import { setServerContext } from "../context.ts";
import { PageLike } from "../tasks/parcel.ts";

export interface PageHandlerProps {
  page: PageLike;
  layouts: PageLike[];
  islands?: Record<string, JSX.Component>;
  scripts?: string[];
  middleware: Middleware[];
  tasks: PluginDefintions["tasks"];
  statusCode: number;
}

export class PageHandler {
  #props: PageHandlerProps;

  constructor(props: PageHandlerProps) {
    this.#props = props;
  }

  handle() {
    return (ctx: PluginTaskContext) => {
      return walkthroughAndHandle(
        ctx,
        this.#props.middleware,
        (ctx: PluginTaskContext) => {
          /*
           * START SYNC RENDER CONTEXT
           */
          setServerContext(ctx);
          if (this.#props.tasks?.beforeRender?.length) {
            for (const task of this.#props.tasks.beforeRender) {
              ctx = task({ ...ctx });
            }
            if (ctx.response) {
              return ctx.response;
            }
          }

          let renderedPage = pageFrom({
            page: this.#props.page,
            layouts: this.#props.layouts,
            islands: this.#props.islands,
            scripts: this.#props.scripts,
            params: ctx.params ?? {},
            data: ctx.data ?? {},
          });

          if (this.#props.tasks?.afterRender?.length) {
            for (const task of this.#props.tasks.afterRender) {
              ctx = task({ pageHtml: renderedPage, ...ctx });
            }
            renderedPage = (<AfterRenderTaskContext> ctx).pageHtml;
            if (ctx.response) {
              return ctx.response;
            }
          }
          setServerContext(undefined);
          /*
           * END SYNC RENDER CONTEXT
           */

          return new Response(
            renderedPage,
            {
              status: this.#props.statusCode,
              headers: {
                "Content-Type": "text/html",
              },
            },
          );
        },
      );
    };
  }
}
