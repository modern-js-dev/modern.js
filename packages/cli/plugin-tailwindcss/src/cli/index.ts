import path from 'path';
import {
  lazyImport,
  PLUGIN_SCHEMAS,
  fs,
  CONFIG_CACHE_DIR,
  globby,
  nanoid,
  slash,
  createRuntimeExportsUtils,
} from '@modern-js/utils';
import type { CliPlugin, NormalizedConfig } from '@modern-js/core';
import { getTailwindConfig } from './tailwind';
import { template, checkTwinMacroNotExist } from './utils';

const supportCssInJsLibrary = 'styled-components';

export const getRandomTwConfigFileName = (internalDirectory: string) => {
  return slash(
    path.join(
      internalDirectory,
      `tailwind.config.${Date.now()}.${nanoid()}.js`,
    ),
  );
};

export default (): CliPlugin => ({
  name: '@modern-js/plugin-tailwindcss',

  setup: async api => {
    const { appDirectory, internalDirectory } = api.useAppContext();
    let internalTwConfigPath = '';
    // When reinstalling dependencies, most of the time the project will be restarted
    const notHaveTwinMacro = await checkTwinMacroNotExist(appDirectory);

    let pluginsExportsUtils: any;
    const designTokenModulePath = path.resolve(__dirname, '../../../../');

    const resolveConfig = lazyImport('tailwindcss/resolveConfig', require);

    const PLUGIN_IDENTIFIER = 'designToken';

    const getDesignTokens = (userConfig: NormalizedConfig) => {
      const {
        source: { designSystem },
      } = userConfig as NormalizedConfig & {
        source: {
          designSystem: Record<string, any>;
        };
      }; // TODO: Type to be filled

      const tailwindcssConfig: Record<string, any> = {};

      tailwindcssConfig.theme = designSystem ? { ...designSystem } : {};

      // not use default design token when designToken.defaultTheme is false or theme is false
      if (!designSystem) {
        tailwindcssConfig.presets = [];
      }

      // when only designSystem exist, need remove supportStyledComponents
      if (designSystem) {
        delete tailwindcssConfig.theme.supportStyledComponents;
      }
      return resolveConfig(tailwindcssConfig).theme || {};
    };
    return {
      prepare() {
        if (notHaveTwinMacro) {
          return;
        }
        internalTwConfigPath = getRandomTwConfigFileName(internalDirectory);
        const globPattern = slash(
          path.join(appDirectory, CONFIG_CACHE_DIR, '*.cjs'),
        );
        const files = globby.sync(globPattern, {
          absolute: true,
        });
        if (files.length > 0) {
          fs.writeFileSync(
            internalTwConfigPath,
            template(files[files.length - 1]),
            'utf-8',
          );
        }
      },

      modifyEntryImports({ entrypoint, imports }: any) {
        const userConfig =
          api.useResolvedConfigContext() as NormalizedConfig & {
            source: {
              designSystem?: {
                supportStyledComponents?: boolean;
              };
            };
          };
        const {
          source: { designSystem },
        } = userConfig;
        if (
          typeof designSystem === 'object' &&
          designSystem.supportStyledComponents
        ) {
          const designTokens = getDesignTokens(userConfig);
          imports.push({
            value: '@modern-js/runtime/plugins',
            specifiers: [
              {
                imported: PLUGIN_IDENTIFIER,
              },
            ],
            initialize: `
  const designTokens = ${JSON.stringify(designTokens)};
            `,
          });
        }

        return {
          entrypoint,
          imports,
        };
      },

      modifyEntryRuntimePlugins({ entrypoint, plugins }: any) {
        const {
          source: { designSystem },
        } = api.useResolvedConfigContext() as NormalizedConfig & {
          source: {
            designSystem?: {
              supportStyledComponents?: boolean;
            };
          };
        };
        let useSCThemeProvider = true;
        if (designSystem) {
          // when designSystem exist, designToken.styledComponents`s default value is false.
          useSCThemeProvider = designSystem?.supportStyledComponents || false;
        }

        if (
          typeof designSystem === 'object' &&
          designSystem.supportStyledComponents
        ) {
          plugins.push({
            name: PLUGIN_IDENTIFIER,
            options: `{token: designTokens, useStyledComponentsThemeProvider: ${
              useSCThemeProvider ? 'true' : 'false'
            }, useDesignTokenContext: false}`,
          });
        }
        return {
          entrypoint,
          plugins,
        };
      },

      validateSchema() {
        return PLUGIN_SCHEMAS['@modern-js/plugin-tailwindcss'];
      },

      addRuntimeExports() {
        pluginsExportsUtils.addExport(
          `export { default as designToken } from '${designTokenModulePath}'`,
        );
      },

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
            // TODO: Add interface about postcss config
            // TODO: In module project, also is called, but should not be called.
            postcss: (config: Record<string, any>) => {
              const modernConfig = api.useResolvedConfigContext();
              const tailwindConfig = getTailwindConfig(modernConfig, {
                pureConfig: {
                  content: [
                    './config/html/**/*.html',
                    './config/html/**/*.ejs',
                    './config/html/**/*.hbs',
                    './src/**/*.js',
                    './src/**/*.jsx',
                    './src/**/*.ts',
                    './src/**/*.tsx',
                    // about storybook
                    './storybook/**/*',
                    './styles/**/*.less',
                    './styles/**/*.css',
                    './styles/**/*.sass',
                    './styles/**/*.scss',
                  ],
                },
              });
              if (Array.isArray(config.postcssOptions.plugins)) {
                config.postcssOptions.plugins.push(
                  require('tailwindcss')(tailwindConfig),
                );
              } else {
                config.postcssOptions.plugins = [
                  require('tailwindcss')(tailwindConfig),
                ];
              }
            },
            babel(config) {
              if (notHaveTwinMacro) {
                return;
              }
              const twinConfig = {
                twin: {
                  preset: supportCssInJsLibrary,
                  config: internalTwConfigPath,
                },
              };
              config.plugins?.some(plugin => {
                if (Array.isArray(plugin) && plugin[0]) {
                  const pluginTarget = plugin[0];
                  let pluginOptions = plugin[1];
                  if (
                    typeof pluginTarget === 'string' &&
                    // TODO: use babel chain
                    slash(pluginTarget).includes('compiled/babel-plugin-macros')
                  ) {
                    if (pluginOptions) {
                      pluginOptions = {
                        ...pluginOptions,
                        ...twinConfig,
                      };
                    } else {
                      plugin.push(twinConfig);
                    }

                    return true;
                  }
                }

                return false;
              });
            },
            // TODO: support less、scss、css vars
            // less: https://github.com/modern-js-dev/modern.js/pull/398/files#diff-f77c749e403fbf1fb676d5687bef3d7138a230331c849298d8afaff9b6afbc3dR166
            // sass: https://github.com/modern-js-dev/modern.js/pull/398/files#diff-f77c749e403fbf1fb676d5687bef3d7138a230331c849298d8afaff9b6afbc3dR229
            // postcss: https://github.com/modern-js-dev/modern.js/pull/398/files#diff-f77c749e403fbf1fb676d5687bef3d7138a230331c849298d8afaff9b6afbc3dR281
          },
        };
      },

      moduleTailwindConfig() {
        const modernConfig = api.useResolvedConfigContext();
        const tailwindConfig = getTailwindConfig(modernConfig, {
          pureConfig: {
            content: [
              './src/**/*.js',
              './src/**/*.jsx',
              './src/**/*.ts',
              './src/**/*.tsx',
              './src/**/*.less',
              './src/**/*.css',
              './src/**/*.sass',
              './src/**/*.scss',
              './styles/**/*.less',
              './styles/**/*.css',
              './styles/**/*.sass',
              './styles/**/*.scss',
            ],
          },
        });
        return require('tailwindcss')(tailwindConfig);
      },
    };
  },
});
