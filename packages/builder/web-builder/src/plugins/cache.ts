import { join } from 'path';
import type { WebBuilderPlugin } from '../types';

export const PluginCache = (): WebBuilderPlugin => ({
  name: 'web-builder-plugin-cache',

  setup(api) {
    api.modifyWebpackChain(chain => {
      const { context } = api;
      const cacheDirectory = join(context.cachePath, 'webpack');
      const buildDependencies: Record<string, string[]> = {};

      if (context.configPath) {
        buildDependencies.config = [context.configPath];
      }
      if (context.tsconfigPath) {
        buildDependencies.tsconfig = [context.tsconfigPath];
      }

      chain.cache({
        type: 'filesystem',
        cacheDirectory,
        buildDependencies,
      });
    });
  },
});
