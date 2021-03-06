import { isProd } from '../shared';
import type {
  WebpackChain,
  WebBuilderConfig,
  WebBuilderPlugin,
  TerserPluginOptions,
  CssMinimizerPluginOptions,
} from '../types';

function applyRemoveConsole(
  options: TerserPluginOptions,
  config: WebBuilderConfig,
) {
  if (!options.terserOptions) {
    options.terserOptions = {};
  }

  const { removeConsole } = config.performance || {};
  const compressOptions =
    typeof options.terserOptions.compress === 'boolean'
      ? options.terserOptions.compress
      : {};

  if (removeConsole === true) {
    options.terserOptions.compress = {
      ...compressOptions,
      drop_console: true,
    };
  } else if (Array.isArray(removeConsole)) {
    const pureFuncs = removeConsole.map(method => `console.${method}`);
    options.terserOptions.compress = {
      ...compressOptions,
      pure_funcs: pureFuncs,
    };
  }

  return options;
}

async function applyJSMinimizer(chain: WebpackChain, config: WebBuilderConfig) {
  const { CHAIN_ID, applyOptionsChain } = await import('@modern-js/utils');
  const { default: TerserPlugin } = await import('terser-webpack-plugin');

  const DEFAULT_OPTIONS: TerserPluginOptions = {
    terserOptions: {
      mangle: {
        safari10: true,
      },
      format: {
        ascii_only: true,
      },
    },
  };

  const mergedOptions = applyOptionsChain(
    DEFAULT_OPTIONS,
    config.tools?.terser,
  );

  const finalOptions = applyRemoveConsole(mergedOptions, config);

  chain.optimization
    .minimizer(CHAIN_ID.MINIMIZER.JS)
    .use(TerserPlugin, [
      // Due to terser-webpack-plugin has changed the type of class, which using a generic type in
      // constructor, leading auto inference of parameters of plugin constructor is not possible, using any instead
      finalOptions as any,
    ])
    .end();
}

async function applyCSSMinimizer(
  chain: WebpackChain,
  config: WebBuilderConfig,
) {
  const { CHAIN_ID, applyOptionsChain } = await import('@modern-js/utils');
  const { default: CssMinimizerPlugin } = await import(
    'css-minimizer-webpack-plugin'
  );

  const mergedOptions: CssMinimizerPluginOptions = applyOptionsChain(
    {},
    config.tools?.minifyCss,
  );

  chain.optimization
    .minimizer(CHAIN_ID.MINIMIZER.CSS)
    .use(CssMinimizerPlugin, [
      // Due to css-minimizer-webpack-plugin has changed the type of class, which using a generic type in
      // constructor, leading auto inference of parameters of plugin constructor is not possible, using any instead
      mergedOptions as any,
    ])
    .end();
}

export const PluginMinimize = (): WebBuilderPlugin => ({
  name: 'web-builder-plugin-minimize',

  setup(api) {
    api.modifyWebpackChain(async chain => {
      const config = api.getBuilderConfig();

      if (isProd() && !config.output?.disableMinimize) {
        await Promise.all([
          applyJSMinimizer(chain, config),
          applyCSSMinimizer(chain, config),
        ]);
      }
    });
  },
});
