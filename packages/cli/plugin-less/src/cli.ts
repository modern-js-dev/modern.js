import { Import, PLUGIN_SCHEMAS } from '@modern-js/utils';
import type { CliPlugin } from '@modern-js/core';

const cssConfig: typeof import('./options') = Import.lazy('./options', require);
const mlc: typeof import('./module-less-config') = Import.lazy(
  './module-less-config',
  require,
);

const LESS_REGEX = /\.less$/;
const LESS_MODULE_REGEX = /\.module\.less$/;
const GLOBAL_LESS_REGEX = /\.global\.less$/;
const NODE_MODULES_REGEX = /node_modules/;

export const isNodeModulesLess = (path: string) =>
  NODE_MODULES_REGEX.test(path) &&
  LESS_REGEX.test(path) &&
  !LESS_MODULE_REGEX.test(path);

export default (): CliPlugin => ({
  name: '@modern-js/plugin-less',

  setup: api => ({
    validateSchema() {
      return PLUGIN_SCHEMAS['@modern-js/plugin-less'];
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
              cssConfig.getLessLoaderOptions(resolvedConfig);

            const loaders = chain.module.rule(RULE.LOADERS);

            // Rule test order:
            // LESS_MODULES -> LESS -> FALLBACK
            loaders
              .oneOf(ONE_OF.LESS_MODULES)
              .before(ONE_OF.LESS)
              .before(ONE_OF.FALLBACK)
              .test(disableCssModuleExtension ? LESS_REGEX : LESS_MODULE_REGEX)
              .merge({
                exclude: disableCssModuleExtension
                  ? [isNodeModulesLess, GLOBAL_LESS_REGEX, ...excludes]
                  : excludes,
                use: [
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error webpack-chain missing type
                  ...loaders.oneOf(ONE_OF.CSS_MODULES).toConfig().use,
                  {
                    loader: require.resolve('less-loader'),
                    options,
                  },
                ],
              });

            loaders
              .oneOf(ONE_OF.LESS)
              .before(ONE_OF.FALLBACK)
              .test(LESS_REGEX)
              .merge({
                exclude: excludes,
                use: [
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error webpack-chain missing type
                  ...loaders.oneOf(ONE_OF.CSS).toConfig().use,
                  {
                    loader: require.resolve('less-loader'),
                    options,
                  },
                ],
              });
          },
        },
      };
    },
    moduleLessConfig: mlc.moduleLessConfig,
    moduleLessCompiler: mlc.moduleLessCompiler,
  }),
});
