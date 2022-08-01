import path from 'path';
import {
  PLUGIN_SCHEMAS,
  createRuntimeExportsUtils,
  cleanRequireCache,
} from '@modern-js/utils';
import type { CliPlugin } from '@modern-js/core';
import PluginState from '../state/cli';
import PluginSSR from '../ssr/cli';
import PluginRouter from '../router/cli';

export default (): CliPlugin => ({
  name: '@modern-js/runtime',
  post: [
    '@modern-js/plugin-router',
    '@modern-js/plugin-ssr',
    '@modern-js/plugin-state',
    '@modern-js/plugin-tailwindcss',
  ],
  usePlugins: [PluginState(), PluginRouter(), PluginSSR()],
  setup: api => {
    let runtimeExportsUtils: ReturnType<typeof createRuntimeExportsUtils> =
      {} as any;

    return {
      config() {
        const dir = api.useAppContext().internalDirectory;
        runtimeExportsUtils = createRuntimeExportsUtils(dir, 'index');
        return {
          runtime: {},
          runtimeByEntries: {},
          source: {
            alias: {
              '@modern-js/runtime$': runtimeExportsUtils.getPath(),
              /**
               * twin.macro inserts styled-components into the code during the compilation process
               * But it will not be installed under the user project.
               * So need to add alias
               */
              'styled-components': require.resolve('styled-components', {
                paths: [require.resolve('@modern-js/runtime-core')],
              }),
            },
          },
        };
      },
      validateSchema() {
        return PLUGIN_SCHEMAS['@modern-js/runtime'];
      },
      addRuntimeExports() {
        const runtimePackage = path.resolve(__dirname, '../../../../');
        runtimeExportsUtils.addExport(`export * from '${runtimePackage}'`);
      },
      async beforeRestart() {
        cleanRequireCache([
          require.resolve('../state/cli'),
          require.resolve('../router/cli'),
          require.resolve('../ssr/cli'),
        ]);
      },
    };
  },
});
