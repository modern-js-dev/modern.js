import path from 'path';
import {
  getEntryOptions,
  createRuntimeExportsUtils,
  PLUGIN_SCHEMAS,
} from '@modern-js/utils';
import type { CliPlugin } from '@modern-js/core';
import {} from '../types';

const PLUGIN_IDENTIFIER = 'state';

export default (): CliPlugin => ({
  name: '@modern-js/plugin-state',
  required: ['@modern-js/runtime'],
  setup: api => {
    const stateConfigMap = new Map<string, any>();

    let pluginsExportsUtils: any;
    const stateModulePath = path.resolve(__dirname, '../');

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
        };
      },
      modifyEntryImports({ entrypoint, imports }: any) {
        const { entryName } = entrypoint;
        const userConfig = api.useResolvedConfigContext();
        const { packageName } = api.useAppContext();

        const stateConfig = getEntryOptions(
          entryName,
          userConfig.runtime,
          userConfig.runtimeByEntries,
          packageName,
        )?.state;

        stateConfigMap.set(entryName, stateConfig);

        const getEnabledPlugins = () => {
          const internalPlugins = [
            'immer',
            'effects',
            'autoActions',
            'devtools',
          ];

          return internalPlugins.filter(
            name => (stateConfig as any)[name] !== false,
          );
        };

        if (stateConfig) {
          imports.push({
            value: '@modern-js/runtime/plugins',
            specifiers: [
              {
                imported: PLUGIN_IDENTIFIER,
              },
            ],
          });
          imports.push({
            value: '@modern-js/runtime/model',
            specifiers: getEnabledPlugins().map(imported => ({ imported })),
            initialize: `
                const createStatePlugins = (config) => {
                  const plugins = [];

                  ${getEnabledPlugins()
                    .map(
                      name => `
                      plugins.push(${name}(config['${name}']));
                      `,
                    )
                    .join('\n')}

                  return plugins;
                }
              `,
          });
        }

        return {
          entrypoint,
          imports,
        };
      },

      modifyEntryRuntimePlugins({ entrypoint, plugins }: any) {
        const stateOptions = stateConfigMap.get(entrypoint.entryName);

        if (stateOptions) {
          const isBoolean = typeof stateOptions === 'boolean';

          let options = isBoolean ? '{}' : JSON.stringify(stateOptions);

          options = `${options.substr(0, options.length - 1)}${
            isBoolean ? '' : ','
          }plugins: createStatePlugins(${JSON.stringify(
            stateConfigMap.get(entrypoint.entryName),
          )})}`;

          plugins.push({
            name: PLUGIN_IDENTIFIER,
            options,
          });
        }
        return {
          entrypoint,
          plugins,
        };
      },
      validateSchema() {
        return PLUGIN_SCHEMAS['@modern-js/plugin-state'];
      },
      addRuntimeExports() {
        pluginsExportsUtils.addExport(
          `export { default as state } from '${stateModulePath}'`,
        );
      },
    };
  },
});
