import path from 'path';
import {
  getEntryOptions,
  SERVER_RENDER_FUNCTION_NAME,
  LOADABLE_STATS_FILE,
  isUseSSRBundle,
  createRuntimeExportsUtils,
  isSingleEntry,
} from '@modern-js/utils';
import type { CliPlugin, SSGMultiEntryOptions } from '@modern-js/core';

const PLUGIN_IDENTIFIER = 'ssr';

export default (): CliPlugin => ({
  name: '@modern-js/plugin-ssr',
  required: ['@modern-js/runtime'],
  setup: api => {
    const ssrConfigMap = new Map<string, any>();

    let pluginsExportsUtils: any;
    const ssrModulePath = path.resolve(__dirname, '../');

    return {
      config() {
        const appContext = api.useAppContext();
        pluginsExportsUtils = createRuntimeExportsUtils(
          appContext.internalDirectory,
          'plugins',
        );

        return {
          source: {
            alias: {
              '@modern-js/runtime/plugins': pluginsExportsUtils.getPath(),
            },
          },
          tools: {
            webpackChain: (chain, { name, CHAIN_ID }) => {
              const userConfig = api.useResolvedConfigContext();
              if (isUseSSRBundle(userConfig) && name !== 'server') {
                // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
                const LoadableWebpackPlugin = require('@modern-js/webpack/@loadable/webpack-plugin');
                chain
                  .plugin(CHAIN_ID.PLUGIN.LOADABLE)
                  .use(LoadableWebpackPlugin, [
                    { filename: LOADABLE_STATS_FILE },
                  ]);
              }
            },
            babel: (config: any) => {
              const userConfig = api.useResolvedConfigContext();
              if (isUseSSRBundle(userConfig)) {
                config.plugins.push(require.resolve('@loadable/babel-plugin'));
              }
            },
          },
        };
      },
      modifyEntryImports({ entrypoint, imports }: any) {
        const { entryName } = entrypoint;
        const userConfig = api.useResolvedConfigContext();
        const { packageName, entrypoints } = api.useAppContext();

        pluginsExportsUtils.addExport(
          `export { default as ssr } from '${ssrModulePath}'`,
        );

        // if use ssg then set ssr config to true
        const ssrConfig = getEntryOptions(
          entryName,
          userConfig.server.ssr,
          userConfig.server.ssrByEntries,
          packageName,
        );

        const ssgConfig = userConfig.output.ssg;
        const useSSG = isSingleEntry(entrypoints)
          ? Boolean(ssgConfig)
          : ssgConfig === true ||
            typeof (ssgConfig as Array<unknown>)?.[0] === 'function' ||
            Boolean((ssgConfig as SSGMultiEntryOptions)?.[entryName]);

        ssrConfigMap.set(entryName, ssrConfig || useSSG);
        if (ssrConfig || useSSG) {
          imports.push({
            value: '@modern-js/runtime/plugins',
            specifiers: [{ imported: PLUGIN_IDENTIFIER }],
          });
        }
        return {
          entrypoint,
          imports,
        };
      },
      modifyEntryRuntimePlugins({ entrypoint, plugins }: any) {
        if (ssrConfigMap.get(entrypoint.entryName)) {
          plugins.push({
            name: PLUGIN_IDENTIFIER,
            options: ssrConfigMap.get(entrypoint.entryName),
          });
        }
        return {
          entrypoint,
          plugins,
        };
      },
      modifyEntryExport({ entrypoint, exportStatement }: any) {
        if (ssrConfigMap.get(entrypoint.entryName)) {
          return {
            entrypoint,
            exportStatement: [
              `export function ${SERVER_RENDER_FUNCTION_NAME}(context) {
              return bootstrap(AppWrapper, context)
            }`,
              exportStatement,
            ].join('\n'),
          };
        }
        return { entrypoint, exportStatement };
      },
    };
  },
});
