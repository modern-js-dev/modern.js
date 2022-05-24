/* eslint-disable max-lines */
import path from 'path';
import {
  chalk,
  isProd,
  isDev,
  signale,
  CHAIN_ID,
  isProdProfile,
  isTypescript,
  ensureAbsolutePath,
  isString,
  applyOptionsChain,
  removeLeadingSlash,
} from '@modern-js/utils';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import webpack, { IgnorePlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import type { IAppContext, NormalizedConfig } from '@modern-js/core';
import { createBabelChain, BabelChain } from '@modern-js/babel-chain';
import WebpackChain from '@modern-js/utils/webpack-chain';
import { merge as webpackMerge } from '../../compiled/webpack-merge';
import WebpackBar from '../../compiled/webpackbar';
import {
  CSS_REGEX,
  JS_REGEX,
  TS_REGEX,
  SVG_REGEX,
  ASSETS_REGEX,
  CSS_MODULE_REGEX,
  GLOBAL_CSS_REGEX,
  JS_RESOLVE_EXTENSIONS,
  CACHE_DIRECTORY,
  NODE_MODULES_CSS_REGEX,
} from '../utils/constants';
import { createCSSRule, enableCssExtract } from '../utils/createCSSRule';
import { mergeRegex } from '../utils/mergeRegex';
import { getWebpackLogging } from '../utils/getWebpackLogging';
import { getBabelOptions, getUseBuiltIns } from '../utils/getBabelOptions';
import { ModuleScopePlugin } from '../plugins/module-scope-plugin';
import { getSourceIncludes } from '../utils/getSourceIncludes';
import { TsConfigPathsPlugin } from '../plugins/ts-config-paths-plugin';
import { getWebpackAliases } from '../utils/getWebpackAliases';
import { getWebpackUtils } from './shared';

export type ResolveAlias = { [index: string]: string };

const { USE, RULE, ONE_OF, PLUGIN, MINIMIZER, RESOLVE_PLUGIN } = CHAIN_ID;

class BaseWebpackConfig {
  chain: WebpackChain;

  appContext: IAppContext;

  metaName: string;

  options: NormalizedConfig;

  appDirectory: string;

  dist: string;

  jsFilename: string;

  jsChunkname: string;

  cssChunkname: string;

  mediaChunkname: string;

  babelChain: BabelChain;

  isTsProject: boolean;

  constructor(appContext: IAppContext, options: NormalizedConfig) {
    this.appContext = appContext;

    this.appDirectory = this.appContext.appDirectory;

    this.metaName = this.appContext.metaName;

    this.options = options;

    this.chain = new WebpackChain();

    this.dist = ensureAbsolutePath(
      this.appDirectory,
      this.options.output ? this.options.output.path! : '',
    );

    this.jsFilename = removeLeadingSlash(
      `${(this.options.output
        ? this.options.output.jsPath!
        : ''
      ).trim()}/[name]${
        isProd() && !this.options.output?.disableAssetsCache
          ? '.[contenthash:8]'
          : ''
      }.js`,
    );

    this.jsChunkname = removeLeadingSlash(
      `${(this.options.output ? this.options.output.jsPath! : '').trim()}/[id]${
        isProd() && !this.options.output.disableAssetsCache
          ? '.[contenthash:8]'
          : ''
      }.js`,
    );

    this.cssChunkname = removeLeadingSlash(
      `${(this.options.output
        ? this.options.output.cssPath!
        : ''
      ).trim()}/[name]${
        isProd() && !this.options.output?.disableAssetsCache
          ? '.[contenthash:8]'
          : ''
      }.css`,
    );

    this.mediaChunkname = removeLeadingSlash(
      `${this.options.output ? this.options.output.mediaPath! : ''}/[name]${
        this.options.output?.disableAssetsCache ? '' : '.[hash:8]'
      }[ext]`,
    );

    this.babelChain = createBabelChain();

    this.isTsProject = isTypescript(this.appDirectory);
  }

  name() {
    // empty
  }

  target() {
    // empty
  }

  mode() {
    const mode = isProd() ? 'production' : 'development';
    this.chain.mode(mode);
    return mode;
  }

  devtool() {
    const { output } = this.options;
    /* eslint-disable no-nested-ternary */
    this.chain.devtool(
      isProd()
        ? output?.disableSourceMap
          ? false
          : 'source-map'
        : 'cheap-module-source-map',
    );
    /* eslint-enable no-nested-ternary */
  }

  entry() {
    const { entrypoints = [], checkedEntries } = this.appContext;

    for (const { entryName, entry } of entrypoints) {
      if (checkedEntries && !checkedEntries.includes(entryName)) {
        continue;
      }
      this.chain.entry(entryName).add(entry);
    }
  }

  output() {
    this.chain.output
      .hashFunction('xxhash64')
      .filename(this.jsFilename)
      .chunkFilename(this.jsChunkname)
      .globalObject('window')
      .path(this.dist)
      .pathinfo(!isProd())
      .devtoolModuleFilenameTemplate(
        // eslint-disable-next-line no-nested-ternary
        isProd()
          ? (info: any) =>
              path
                .relative(
                  this.appContext.srcDirectory,
                  info.absoluteResourcePath,
                )
                .replace(/\\/g, '/')
          : isDev()
          ? (info: any) =>
              path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
          : undefined,
      )
      .publicPath(this.publicPath());

    this.chain.output.merge({
      assetModuleFilename: this.mediaChunkname,
      environment: {
        arrowFunction: false,
        bigIntLiteral: false,
        const: false,
        destructuring: false,
        dynamicImport: false,
        forOf: false,
        module: false,
      },
    });
  }

  publicPath() {
    let publicPath =
      /* eslint-disable no-nested-ternary */
      isProd()
        ? this.options.output
          ? this.options.output.assetPrefix!
          : ''
        : isString(this.options.dev?.assetPrefix)
        ? this.options.dev.assetPrefix
        : (this.options.dev ? this.options.dev.assetPrefix : '')
        ? `//${this.appContext.ip || 'localhost'}:${
            this.appContext.port || '8080'
          }/`
        : '/';
    /* eslint-enable no-nested-ternary */

    if (!publicPath.endsWith('/')) {
      publicPath += '/';
    }

    return publicPath;
  }

  loaders() {
    this.chain.module
      .rule(RULE.MJS)
      .test(/\.m?js/)
      .resolve.set('fullySpecified', false);

    const loaders = this.chain.module.rule(RULE.LOADERS);

    //  js、ts
    const useTsLoader = Boolean(this.options.output?.enableTsLoader);

    loaders
      .oneOf(ONE_OF.JS)
      .test(useTsLoader ? JS_REGEX : mergeRegex(JS_REGEX, TS_REGEX))
      .include.add(this.appContext.srcDirectory)
      .add(this.appContext.internalDirectory)
      .end()
      .use(USE.BABEL)
      .loader(require.resolve('../../compiled/babel-loader'))
      .options(
        getBabelOptions(
          this.metaName,
          this.appDirectory,
          this.options,
          this.babelChain,
        ),
      );

    if (useTsLoader) {
      loaders
        .oneOf(ONE_OF.TS)
        .test(TS_REGEX)
        .include.add(this.appContext.srcDirectory)
        .add(this.appContext.internalDirectory)
        .end()
        .use(USE.BABEL)
        .loader(require.resolve('../../compiled/babel-loader'))
        .options({
          presets: [
            [
              require.resolve('@modern-js/babel-preset-app'),
              {
                metaName: this.metaName,
                appDirectory: this.appDirectory,
                target: 'client',
                useTsLoader: true,
                useBuiltIns: getUseBuiltIns(this.options),
                userBabelConfig: this.options.tools.babel,
              },
            ],
          ],
        })
        .end()
        .use(USE.TS)
        .loader(require.resolve('ts-loader'))
        .options(
          applyOptionsChain(
            {
              compilerOptions: {
                target: 'es5',
                module: 'ESNext',
              },
              transpileOnly: false,
              allowTsInNodeModules: true,
            },
            this.options.tools?.tsLoader,
          ),
        );
    }

    const includes = getSourceIncludes(this.appDirectory, this.options);

    if (includes.length > 0) {
      const includeRegex = mergeRegex(...includes);
      const testResource = (resource: string) => includeRegex.test(resource);
      loaders.oneOf(ONE_OF.JS).include.add(testResource);

      if (loaders.oneOfs.has(ONE_OF.TS)) {
        loaders.oneOf(ONE_OF.TS).include.add(testResource);
      }
    }

    const disableCssModuleExtension =
      this.options.output?.disableCssModuleExtension ?? false;

    // css
    createCSSRule(
      this.chain,
      {
        appDirectory: this.appDirectory,
        config: this.options,
      },
      {
        name: ONE_OF.CSS,
        // when disableCssModuleExtension is true,
        // only transfer *.global.css and node_modules/**/*.css
        test: disableCssModuleExtension
          ? [NODE_MODULES_CSS_REGEX, GLOBAL_CSS_REGEX]
          : CSS_REGEX,
        exclude: [CSS_MODULE_REGEX],
      },
      {
        importLoaders: 1,
        esModule: false,
        sourceMap: isProd() && !this.options.output?.disableSourceMap,
      },
    );

    // css modules
    createCSSRule(
      this.chain,
      {
        appDirectory: this.appDirectory,
        config: this.options,
      },
      {
        name: ONE_OF.CSS_MODULES,
        test: disableCssModuleExtension ? CSS_REGEX : CSS_MODULE_REGEX,
        exclude: disableCssModuleExtension
          ? [/node_modules/, GLOBAL_CSS_REGEX]
          : [],
        genTSD: this.options.output?.enableCssModuleTSDeclaration,
      },
      {
        importLoaders: 1,
        esModule: false,
        modules: {
          localIdentName: this.options.output
            ? this.options.output.cssModuleLocalIdentName!
            : '',
          exportLocalsConvention: 'camelCase',
        },
        sourceMap: isProd() && !this.options.output?.disableSourceMap,
      },
    );

    // svg
    loaders
      .oneOf(ONE_OF.SVG_INLINE)
      .test(SVG_REGEX)
      .type('javascript/auto')
      .resourceQuery(/inline/)
      .use(USE.SVGR)
      .loader(require.resolve('@svgr/webpack'))
      .options({ svgo: false })
      .end()
      .use(USE.URL)
      .loader(require.resolve('../../compiled/url-loader'))
      .options({
        limit: Infinity,
        name: this.mediaChunkname.replace(/\[ext\]$/, '.[ext]'),
      });

    loaders
      .oneOf(ONE_OF.SVG_URL)
      .test(SVG_REGEX)
      .type('javascript/auto')
      .resourceQuery(/url/)
      .use(USE.SVGR)
      .loader(require.resolve('@svgr/webpack'))
      .options({ svgo: false })
      .end()
      .use(USE.URL)
      .loader(require.resolve('../../compiled/url-loader'))
      .options({
        limit: false,
        name: this.mediaChunkname.replace(/\[ext\]$/, '.[ext]'),
      });

    loaders
      .oneOf(ONE_OF.SVG)
      .test(SVG_REGEX)
      .type('javascript/auto')
      .use(USE.SVGR)
      .loader(require.resolve('@svgr/webpack'))
      .options({ svgo: false })
      .end()
      .use(USE.URL)
      .loader(require.resolve('../../compiled/url-loader'))
      .options({
        limit: this.options.output?.dataUriLimit,
        name: this.mediaChunkname.replace(/\[ext\]$/, '.[ext]'),
      });

    // img, font assets
    loaders
      .oneOf(ONE_OF.ASSETS_INLINE)
      .test(ASSETS_REGEX)
      .type('asset/inline' as any)
      .resourceQuery(/inline/);

    loaders
      .oneOf(ONE_OF.ASSETS_URL)
      .test(ASSETS_REGEX)
      .type('asset/resource' as any)
      .resourceQuery(/url/);

    loaders
      .oneOf(ONE_OF.ASSETS)
      .test(ASSETS_REGEX)
      .type('asset' as any)
      .parser({
        dataUrlCondition: { maxSize: this.options.output?.dataUriLimit },
      });

    // yml, toml, markdown
    loaders
      .oneOf(ONE_OF.YAML)
      .test(/\.ya?ml$/)
      .use(USE.YAML)
      .loader(require.resolve('../../compiled/yaml-loader'));

    loaders
      .oneOf(ONE_OF.TOML)
      .test(/\.toml$/)
      .use(USE.TOML)
      .loader(require.resolve('../../compiled/toml-loader'));

    loaders
      .oneOf(ONE_OF.MARKDOWN)
      .test(/\.md$/)
      .use(USE.HTML)
      .loader(require.resolve('html-loader'))
      .end()
      .use(USE.MARKDOWN)
      .loader(require.resolve('../../compiled/markdown-loader'));

    //  resource fallback
    loaders
      .oneOf(ONE_OF.FALLBACK)
      .exclude.add(/^$/)
      .add(JS_REGEX)
      .add(TS_REGEX)
      .add(CSS_REGEX)
      .add(CSS_MODULE_REGEX)
      .add(/\.(html?|json|wasm|ya?ml|toml|md)$/)
      .end()
      .use(USE.FILE)
      .loader(require.resolve('../../compiled/file-loader'));

    return loaders;
  }

  plugins() {
    // progress bar
    process.stdout.isTTY &&
      this.chain
        .plugin(PLUGIN.PROGRESS)
        .use(WebpackBar, [{ name: this.chain.get('name') }]);

    if (enableCssExtract(this.options)) {
      this.chain.plugin(PLUGIN.MINI_CSS_EXTRACT).use(MiniCssExtractPlugin, [
        {
          filename: this.cssChunkname,
          chunkFilename: this.cssChunkname,
          ignoreOrder: true,
        },
      ]);
    }

    this.chain.plugin(PLUGIN.IGNORE).use(IgnorePlugin, [
      {
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      },
    ]);

    const { output } = this.options;
    if (
      // only enable ts-checker plugin in ts project
      this.isTsProject &&
      // no need to use ts-checker plugin when using ts-loader
      !output.enableTsLoader &&
      !output.disableTsChecker
    ) {
      this.chain.plugin(PLUGIN.TS_CHECKER).use(ForkTsCheckerWebpackPlugin, [
        {
          typescript: {
            // avoid OOM issue
            memoryLimit: 8192,
            // use tsconfig of user project
            configFile: path.resolve(this.appDirectory, './tsconfig.json'),
            // use typescript of user project
            typescriptPath: require.resolve('typescript'),
          },
          issue: {
            include: [{ file: '**/src/**/*' }],
            exclude: [{ file: '**/*.(spec|test).ts' }],
          },
        },
      ]);
    }
  }

  resolve() {
    // resolve extensions
    const extensions = JS_RESOLVE_EXTENSIONS.filter(
      ext => this.isTsProject || !ext.includes('ts'),
    );

    for (const ext of extensions) {
      this.chain.resolve.extensions.add(ext);
    }

    //  resolve alias
    const defaultAlias: ResolveAlias = getWebpackAliases(
      this.appContext,
      this.options._raw,
    );

    const alias = applyOptionsChain<ResolveAlias, undefined>(
      defaultAlias,
      this.options.source?.alias as ResolveAlias,
    );

    for (const name of Object.keys(alias)) {
      this.chain.resolve.alias.set(
        name,
        (
          (Array.isArray(alias[name]) ? alias[name] : [alias[name]]) as string[]
        ).map(a => ensureAbsolutePath(this.appDirectory, a)) as any,
      );
    }

    //  resolve modules
    this.chain.resolve.modules
      .add('node_modules')
      .add(this.appContext.nodeModulesDirectory);

    let defaultScopes: any[] = ['./src', /node_modules/, './shared'];

    const scopeOptions = this.options.source?.moduleScopes;

    if (Array.isArray(scopeOptions)) {
      if (scopeOptions.some(s => typeof s === 'function')) {
        for (const scope of scopeOptions) {
          if (typeof scope === 'function') {
            const ret = scope(defaultScopes);
            defaultScopes = ret ? ret : defaultScopes;
          } else {
            defaultScopes.push(scope);
          }
        }
      } else {
        defaultScopes.push(...scopeOptions);
      }
    }

    // resolve plugin(module scope)
    this.chain.resolve
      .plugin(RESOLVE_PLUGIN.MODULE_SCOPE)
      .use(ModuleScopePlugin, [
        {
          appSrc: defaultScopes.map((scope: string | RegExp) => {
            if (isString(scope)) {
              return ensureAbsolutePath(this.appDirectory, scope);
            }
            return scope;
          }),
          allowedFiles: [path.resolve(this.appDirectory, './package.json')],
        },
      ]);

    if (this.isTsProject) {
      // aliases from tsconfig.json
      this.chain.resolve
        .plugin(RESOLVE_PLUGIN.TS_CONFIG_PATHS)
        .use(TsConfigPathsPlugin, [this.appDirectory]);
    }
  }

  cache() {
    this.chain.cache({
      type: 'filesystem',
      cacheDirectory: path.resolve(
        this.appDirectory,
        CACHE_DIRECTORY,
        'webpack',
      ),
      buildDependencies: {
        defaultWebpack: [require.resolve('webpack/lib')],
        config: [__filename, this.appContext.configFile].filter(Boolean),
        tsconfig: [
          this.isTsProject &&
            path.resolve(this.appDirectory, './tsconfig.json'),
        ].filter(Boolean),
      },
    });
  }

  optimization() {
    this.chain.optimization
      .minimize(isProd() && !this.options.output?.disableMinimize)
      .splitChunks({ chunks: 'all' })
      .runtimeChunk({ name: (entrypoint: any) => `runtime-${entrypoint.name}` })
      .minimizer(MINIMIZER.JS)
      .use(TerserPlugin, [
        // FIXME: any type
        applyOptionsChain<any, any>(
          {
            terserOptions: {
              parse: { ecma: 8 },
              compress: {
                ecma: 5,
                warnings: false,
                comparisons: false,
                inline: 2,
              },
              mangle: { safari10: true },
              // Added for profiling in devtools
              keep_classnames: isProdProfile(),
              keep_fnames: isProdProfile(),
              output: {
                ecma: 5,
                ascii_only: true,
              },
            },
          },
          this.options.tools?.terser,
        ),
      ])
      .end()
      .minimizer(MINIMIZER.CSS)
      // FIXME: add `<any>` reason: Since the css-minimizer-webpack-plugin has been updated
      .use<any>(CssMinimizerPlugin, [
        applyOptionsChain({}, this.options.tools?.minifyCss),
      ]);
  }

  stats() {
    this.chain.stats('none');
    this.chain.merge({ infrastructureLogging: getWebpackLogging() });
  }

  config() {
    const chain = this.getChain();
    const chainConfig = chain.toConfig();

    let finalConfig = chainConfig;

    if (this.options.tools?.webpack) {
      let isChainUsed = false;

      const proxiedChain = new Proxy(chain, {
        get(target, property) {
          isChainUsed = true;
          return (target as any)[property];
        },
      });

      const mergedConfig = applyOptionsChain(
        chainConfig,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error utils type incompatible
        this.options.tools?.webpack,
        {
          chain: proxiedChain,
          env: process.env.NODE_ENV,
          name: chain.get('name'),
          webpack,
          ...getWebpackUtils(chainConfig),
        },
        webpackMerge,
      );

      // Compatible with the legacy `chain` usage, if `chain` is called in `tools.webpack`,
      // using the chained config as finalConfig, otherwise using the merged webpack config.
      if (isChainUsed) {
        finalConfig = chain.toConfig();

        if (isDev()) {
          signale.warn(
            `The ${chalk.cyan('chain')} param of ${chalk.cyan(
              'tools.webpack',
            )} is deprecated, please use ${chalk.cyan(
              'tools.webpackChain',
            )} instead.`,
          );
        }
      } else {
        finalConfig = mergedConfig;
      }
    }

    // TODO remove webpackFinal
    if ((this.options.tools as any)?.webpackFinal) {
      return applyOptionsChain(
        finalConfig,
        (this.options.tools as any)?.webpackFinal,
        {
          name: chain.get('name'),
          webpack,
        },
        webpackMerge,
      );
    }

    return finalConfig;
  }

  watchOptions() {
    if (isDev()) {
      this.chain.watchOptions({
        // fix webpack watch mode rebuild twice on file change
        // https://github.com/webpack/webpack/issues/15431
        aggregateTimeout: 100,
      });
    }
  }

  applyToolsWebpackChain() {
    if (!this.options.tools) {
      return;
    }

    const { webpackChain } = this.options.tools;
    if (webpackChain) {
      const toArray = <T>(item: T | T[]): T[] =>
        Array.isArray(item) ? item : [item];

      toArray(webpackChain).forEach(item => {
        item(this.chain, {
          env: process.env.NODE_ENV!,
          name: this.chain.get('name'),
          webpack,
          CHAIN_ID,
        });
      });
    }
  }

  getChain() {
    this.chain.context(this.appDirectory);

    this.chain.bail(isProd());
    this.chain.node.set('global', true);

    this.name();
    this.target();
    this.mode();
    this.devtool();
    this.entry();
    this.output();
    this.loaders();
    this.plugins();
    this.resolve();
    this.cache();
    this.optimization();
    this.stats();
    this.watchOptions();
    this.applyToolsWebpackChain();

    return this.chain;
  }
}

export { BaseWebpackConfig };
/* eslint-enable max-lines */
