import { log } from "cargo/utils/mod.ts";
import { RequestContext } from "cargo/http/mod.ts";

export interface PluginTaskContext extends RequestContext {
  response?: Response;
}

export type BeforeRenderTask = (
  ctx: PluginTaskContext,
) => PluginTaskContext;

export interface AfterRenderTaskContext extends PluginTaskContext {
  pageHtml: string;
}

export type AfterRenderTask = (
  ctx: AfterRenderTaskContext,
) => AfterRenderTaskContext;

export interface PluginDefintions {
  scripts?: string[];
  entryPoints?: Record<string, string>;
  tasks?: {
    beforeRender?: BeforeRenderTask[];
    afterRender?: AfterRenderTask[];
  };
}

export interface Plugin {
  name: string;
  plugin(): Promise<PluginDefintions> | PluginDefintions;
}

export async function plugins(plugins?: Plugin[]): Promise<PluginDefintions> {
  const scripts: PluginDefintions["scripts"] = [];
  let entryPoints: PluginDefintions["entryPoints"] = {};
  const beforeRender: BeforeRenderTask[] = [];
  const afterRender: AfterRenderTask[] = [];

  if (plugins?.length) {
    for (const plugin of plugins) {
      const pluginDefinition = await plugin.plugin();
      if (pluginDefinition.scripts) {
        scripts.push(...pluginDefinition.scripts);
      }
      if (pluginDefinition.entryPoints) {
        entryPoints = { ...entryPoints, ...pluginDefinition.entryPoints };
      }
      if (pluginDefinition.tasks?.beforeRender?.length) {
        beforeRender.push(...pluginDefinition.tasks.beforeRender);
      }
      if (pluginDefinition.tasks?.afterRender?.length) {
        afterRender.push(...pluginDefinition.tasks.afterRender);
      }
      log("Plugin", `${plugin.name} loaded!`);
    }
  }
  return {
    scripts,
    entryPoints,
    tasks: {
      beforeRender,
      afterRender,
    },
  };
}
