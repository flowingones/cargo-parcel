interface AfterRenderTaskContext {
  pageHtml: string;
}

type AfterRenderTask = (
  ctx: AfterRenderTaskContext,
) => Promise<string> | string;

export interface PluginDefintions {
  scripts?: string[];
  entryPoints?: Record<string, string>;
  tasks?: {
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
      if (pluginDefinition.tasks?.afterRender?.length) {
        afterRender.push(...pluginDefinition.tasks.afterRender);
      }
    }
  }
  return {
    scripts,
    entryPoints,
    tasks: {
      afterRender,
    },
  };
}
