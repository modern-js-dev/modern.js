import { Import, PLUGIN_SCHEMAS } from '@modern-js/utils';
import type { CliPlugin } from '@modern-js/core';

const SASS_REGEX = /\.s(a|c)ss$/;
const SASS_MODULE_REGEX = /\.module\.s(a|c)ss$/;
const GLOBAL_SASS_REGEX = /\.global\.s(a|c)ss$/;
const NODE_MODULES_REGEX = /node_modules/;

export const isNodeModulesSass = (path: string) =>
  NODE_MODULES_REGEX.test(path) &&
  SASS_REGEX.test(path) &&
  !SASS_MODULE_REGEX.test(path);

export default (): CliPlugin => ({
  name: '@modern-js/plugin-sass',

  setup: api => {
    const cssConfig: typeof import('./options') = Import.lazy(
      './options',
      require,
    );
    const msc: typeof import('./module-sass-config') = Import.lazy(
      './module-sass-config',
      require,
    );
    return {
      validateSchema() {
        return PLUGIN_SCHEMAS['@modern-js/plugin-sass'];
      },
      config() {
        return {
          tools: {
            webpackChain: (chain, { CHAIN_ID }) => {
              const { RULE, ONE_OF } = CHAIN_ID;
              const resolvedConfig = api.useResolvedConfigContext();

              const {
                output: { disableCssModuleExtension },
              } = resolvedConfig;

              const { options, excludes } =
                cssConfig.getSassLoaderOptions(resolvedConfig);

              const loaders = chain.module.rule(RULE.LOADERS);

              // Rule test order:
              // SASS_MODULES -> SASS -> FALLBACK
              loaders
                .oneOf(ONE_OF.SASS_MODULES)
                .before(ONE_OF.SASS)
                .before(ONE_OF.FALLBACK)
                .test(
                  disableCssModuleExtension ? SASS_REGEX : SASS_MODULE_REGEX,
                )
                .merge({
                  exclude: disableCssModuleExtension
                    ? [isNodeModulesSass, GLOBAL_SASS_REGEX, ...excludes]
                    : excludes,
                  use: [
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error webpack-chain missing minimizers type
                    ...loaders.oneOf(ONE_OF.CSS_MODULES).toConfig().use,
                    {
                      loader: require.resolve('sass-loader'),
                      options,
                    },
                  ],
                });

              loaders
                .oneOf(ONE_OF.SASS)
                .before(ONE_OF.FALLBACK)
                .test(SASS_REGEX)
                .merge({
                  exclude: excludes,
                  use: [
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error webpack-chain missing minimizers type
                    ...loaders.oneOf(ONE_OF.CSS).toConfig().use,
                    {
                      loader: require.resolve('sass-loader'),
                      options,
                    },
                  ],
                });
            },
          },
        };
      },
      moduleSassConfig: msc.moduleSassConfig,
      moduleSassCompiler: msc.moduleSassCompiler,
    };
  },
});
