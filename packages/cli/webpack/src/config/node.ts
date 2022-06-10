import type { ServerConfig } from '@modern-js/core';
import {
  applyOptionsChain,
  isProd,
  isUseSSRBundle,
  SERVER_BUNDLE_DIRECTORY,
} from '@modern-js/utils';
import { DefinePlugin } from 'webpack';
import type { WebpackChain } from '../compiled';
import { BaseWebpackConfig } from './base';
import { CHAIN_ID, enableBundleAnalyzer } from './shared';

export function filterEntriesBySSRConfig(
  chain: WebpackChain,
  serverConfig?: ServerConfig,
) {
  if (!serverConfig?.ssrByEntries) {
    return;
  }

  const { ssr, ssrByEntries } = serverConfig;
  const entries = chain.entryPoints.entries();

  Object.keys(entries).forEach(name => {
    if (
      (ssr && ssrByEntries[name] === false) ||
      (!ssr && ssrByEntries[name] !== true)
    ) {
      chain.entryPoints.delete(name);
    }
  });
}

class NodeWebpackConfig extends BaseWebpackConfig {
  name() {
    this.chain.name('server');
  }

  target() {
    this.chain.target('node');
  }

  devtool() {
    this.chain.devtool(false);
  }

  entry() {
    super.entry();
    filterEntriesBySSRConfig(this.chain, this.options.server);
  }

  output() {
    super.output();
    this.chain.output
      .libraryTarget('commonjs2')
      .filename(`${SERVER_BUNDLE_DIRECTORY}/[name].js`);

    this.chain.output.delete('chunkFilename');
  }

  optimization() {
    super.optimization();
    this.chain.optimization.splitChunks(false as any).runtimeChunk(false);
  }

  loaders() {
    const { USE, ONE_OF } = CHAIN_ID;
    const loaders = super.loaders();

    // css & css modules
    if (loaders.oneOfs.has(ONE_OF.CSS)) {
      loaders.oneOf(ONE_OF.CSS).uses.delete(USE.MINI_CSS_EXTRACT);
      loaders.oneOf(ONE_OF.CSS).uses.delete(USE.STYLE);
    }

    loaders
      .oneOf(ONE_OF.CSS_MODULES)
      .uses.delete(USE.MINI_CSS_EXTRACT)
      .end()
      .uses.delete(USE.STYLE)
      .end()
      .use(USE.CSS)
      .options({
        sourceMap: isProd() && !this.options.output?.disableSourceMap,
        importLoaders: 1,
        modules: {
          localIdentName: this.options.output
            ? this.options.output.cssModuleLocalIdentName!
            : '',
          exportLocalsConvention: 'camelCase',
          exportOnlyLocals: true,
        },
      });

    const babelOptions = loaders.oneOf(ONE_OF.JS).use(USE.BABEL).get('options');

    loaders
      .oneOf(ONE_OF.JS)
      .use(USE.BABEL)
      .options({
        ...babelOptions,
        presets: [
          [
            require.resolve('@modern-js/babel-preset-app'),
            {
              metaName: this.appContext.metaName,
              appDirectory: this.appDirectory,
              target: 'server',
              useLegacyDecorators: !this.options.output?.enableLatestDecorators,
              useBuiltIns: false,
              chain: this.babelChain,
              styledComponents: applyOptionsChain(
                {
                  pure: true,
                  displayName: true,
                  ssr: isUseSSRBundle(this.options),
                  transpileTemplateLiterals: true,
                },
                this.options.tools?.styledComponents,
              ),
              userBabelConfig: this.options.tools.babel,
            },
          ],
        ],
      });

    // TODO: ts-loader

    return loaders;
  }

  private useDefinePlugin() {
    const { globalVars } = this.options.source || {};
    this.chain.plugin('define').use(DefinePlugin, [
      {
        ...Object.keys(globalVars || {}).reduce<Record<string, string>>(
          (memo, name) => {
            memo[name] = globalVars ? JSON.stringify(globalVars[name]) : '';
            return memo;
          },
          {},
        ),
      },
    ]);
  }

  plugins() {
    super.plugins();

    this.useDefinePlugin();

    // Avoid repeated execution of ts checker
    this.chain.plugins.delete(CHAIN_ID.PLUGIN.TS_CHECKER);

    if (this.options.cliOptions?.analyze) {
      enableBundleAnalyzer(this.chain, 'report-ssr.html');
    }
  }

  resolve() {
    super.resolve();
    for (const ext of [
      '.node.js',
      '.node.jsx',
      '.node.ts',
      '.node.tsx',
    ].reverse()) {
      this.chain.resolve.extensions.prepend(ext);
    }
    this.chain.resolve.mainFields.clear().add('main');
  }

  config() {
    const config = super.config();

    // prod bundle all dependencies
    if (isProd()) {
      config.externals = [];
      return config;
    }

    config.externals = config.externals || [];

    if (!Array.isArray(config.externals)) {
      config.externals = [config.externals].filter(Boolean);
    }

    return config;
  }
}

export { NodeWebpackConfig };
