import { pick } from '../shared';
import { createContext, createPublicContext } from './createContext';
import { createPluginStore } from './createPluginStore';
import { initConfigs } from './initConfigs';
import type { PluginStore, WebBuilderOptions } from '../types';

function mergeWebBuilderOptions(options?: WebBuilderOptions) {
  const DEFAULT_OPTIONS: Required<WebBuilderOptions> = {
    cwd: process.cwd(),
    target: ['web'],
    configPath: null,
    builderConfig: {},
  };

  return {
    ...DEFAULT_OPTIONS,
    ...options,
  };
}

export async function createBuilder(options?: WebBuilderOptions) {
  const WebBuilderOptions = mergeWebBuilderOptions(options);
  const context = await createContext(WebBuilderOptions);
  const publicContext = createPublicContext(context);
  const pluginStore = await createPluginStore();

  await addDefaultPlugins(pluginStore);

  const build = async () => {
    const { build } = await import('./build');
    const { webpackConfigs } = await initConfigs({
      context,
      pluginStore,
      WebBuilderOptions,
    });
    return build({ context, webpackConfigs });
  };

  const createCompiler = async () => {
    const { createCompiler } = await import('./createCompiler');
    const { webpackConfigs } = await initConfigs({
      context,
      pluginStore,
      WebBuilderOptions,
    });
    return createCompiler({ context, webpackConfigs });
  };

  return {
    ...pick(pluginStore, ['addPlugins', 'removePlugins', 'isPluginExists']),
    build,
    context: publicContext,
    createCompiler,
  };
}

async function addDefaultPlugins(pluginStore: PluginStore) {
  const { PluginMode } = await import('../plugins/mode');
  const { PluginCopy } = await import('../plugins/copy');
  const { PluginCache } = await import('../plugins/cache');
  const { PluginTarget } = await import('../plugins/target');
  const { PluginDevtool } = await import('../plugins/devtool');
  const { PluginProgress } = await import('../plugins/progress');
  const { PluginMinimize } = await import('../plugins/minimize');
  const { PluginCleanOutput } = await import('../plugins/cleanOutput');

  pluginStore.addPlugins([
    // Plugins that provide basic webpack config
    PluginMode(),
    PluginCache(),
    PluginTarget(),
    PluginDevtool(),

    // Plugins that provide basic features
    PluginCopy(),
    PluginProgress(),
    PluginMinimize(),
    PluginCleanOutput(),
  ]);
}
