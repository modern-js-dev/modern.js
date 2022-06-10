import path from 'path';
import {
  getEntryOptions,
  SERVER_RENDER_FUNCTION_NAME,
  LOADABLE_STATS_FILE,
  isUseSSRBundle,
  createRuntimeExportsUtils,
  PLUGIN_SCHEMAS,
} from '@modern-js/utils';
import type { CliPlugin } from '@modern-js/core';
import LoadableWebpackPlugin from '@loadable/webpack-plugin';
import type WebpackChain from 'webpack-chain';
import type { BabelChain } from '@modern-js/babel-chain';

const PLUGIN_IDENTIFIER = 'ssr';

export default (): CliPlugin => ({
  name: '@modern-js/plugin-ssr',
  required: ['@modern-js/runtime'],
  setup: api => {
    const ssrConfigMap = new Map<string, any>();

    let pluginsExportsUtils: any;
    const ssrModulePath = path.resolve(__dirname, '../../../../');

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
            webpack: (config: any, { chain }: { chain: WebpackChain }) => {
              const userConfig = api.useResolvedConfigContext();
              if (isUseSSRBundle(userConfig) && config.name !== 'server') {
                chain
                  .plugin('loadable')
                  .use(LoadableWebpackPlugin, [
                    { filename: LOADABLE_STATS_FILE },
                  ]);
              }
            },
            babel: (config: any, { chain }: { chain: BabelChain }) => {
              const userConfig = api.useResolvedConfigContext();
              if (isUseSSRBundle(userConfig)) {
                chain
                  ?.plugin('loadable')
                  .use(require.resolve('@loadable/babel-plugin'));
              }
            },
          },
        };
      },
      validateSchema() {
        return PLUGIN_SCHEMAS['@modern-js/plugin-ssr'];
      },
      modifyEntryImports({ entrypoint, imports }: any) {
        const { entryName } = entrypoint;
        const userConfig = api.useResolvedConfigContext();
        const { packageName } = api.useAppContext();

        pluginsExportsUtils.addExport(
          `export { default as ssr } from '${ssrModulePath}'`,
        );

        // if use ssg then set ssr config to true
        const ssrConfig =
          Boolean(userConfig.output.ssg) ||
          getEntryOptions(
            entryName,
            userConfig.server.ssr,
            userConfig.server.ssrByEntries,
            packageName,
          );
        ssrConfigMap.set(entryName, ssrConfig);
        if (ssrConfig) {
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
