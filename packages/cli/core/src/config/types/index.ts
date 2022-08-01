import type { IncomingMessage, ServerResponse } from 'http';
import type { NextFunction, BffProxyOptions } from '@modern-js/types';
import type {
  MetaOptions,
  ChainIdentifier,
  WatchOptions,
} from '@modern-js/utils';
import type { TransformOptions, PluginItem as BabelPlugin } from '@babel/core';
import type webpack from 'webpack';
import type {
  RuleSetRule,
  Configuration as WebpackConfiguration,
  WebpackPluginInstance,
} from 'webpack';
import type WebpackChain from '@modern-js/utils/webpack-chain';
import type autoprefixer from 'autoprefixer';
import type {
  BasePluginOptions,
  TerserOptions as RawTerserOptions,
} from 'terser-webpack-plugin';
import type { AcceptedPlugin as PostCSSPlugin } from 'postcss';
import type { PluginConfig } from '../../loadPlugins';
import type { TestConfig, JestConfig } from './test';
import type { SassConfig, SassLoaderOptions, SassOption } from './sass';
import type { LessConfig, LessLoaderOptions, LessOption } from './less';
import type { UnbundleConfig } from './unbundle';
import type {
  SSGConfig,
  SSGRouteOptions,
  SSGMultiEntryOptions,
  SSGSingleEntryOptions,
} from './ssg';
import type { ElectronConfig } from './electron';
import type { PostCSSLoaderOptions, PostcssOption } from './postcss';
import type { TsLoaderOptions } from './ts-loader';

type AutoprefixerOptions = autoprefixer.Options;

type TerserOptions = BasePluginOptions & {
  terserOptions?: Partial<RawTerserOptions>;
};

export type {
  TestConfig,
  JestConfig,
  UnbundleConfig,
  PostcssOption,
  SassConfig,
  SassLoaderOptions,
  SassOption,
  LessConfig,
  LessLoaderOptions,
  LessOption,
  SSGConfig,
  SSGRouteOptions,
  SSGMultiEntryOptions,
  SSGSingleEntryOptions,
  TransformOptions,
  AutoprefixerOptions,
  TerserOptions,
};

export interface SourceConfig {
  entries?: Record<
    string,
    | string
    | {
        entry: string;
        enableFileSystemRoutes?: boolean;
        disableMount?: boolean;
      }
  >;
  preEntry?: string | string[];
  disableDefaultEntries?: boolean;
  entriesDir?: string;
  configDir?: string;
  apiDir?: string;
  envVars?: Array<string>;
  globalVars?: Record<string, string>;
  alias?:
    | Record<string, string>
    | ((aliases: Record<string, string>) => Record<string, unknown>);
  moduleScopes?:
    | Array<string | RegExp>
    | ((scopes: Array<string | RegExp>) => void)
    | ((scopes: Array<string | RegExp>) => Array<string | RegExp>);
  include?: Array<string | RegExp>;

  /**
   * The configuration of `source.designSystem` is provided by `tailwindcss` plugin.
   * Please use `yarn new` or `pnpm new` to enable the corresponding capability.
   * @requires `tailwindcss` plugin
   */
  designSystem?: Record<string, any>;
}

export interface OutputConfig {
  assetPrefix?: string;
  htmlPath?: string;
  jsPath?: string;
  cssPath?: string;
  mediaPath?: string;
  path?: string;
  title?: string;
  titleByEntries?: Record<string, string>;
  meta?: MetaOptions;
  metaByEntries?: Record<string, MetaOptions>;
  inject?: 'body' | 'head' | boolean;
  injectByEntries?: Record<string, 'body' | 'head' | boolean>;
  mountId?: string;
  favicon?: string;
  faviconByEntries?: Record<string, string | undefined>;
  copy?: Array<Record<string, unknown> & { from: string }>;
  scriptExt?: Record<string, unknown>;
  disableTsChecker?: boolean;
  disableHtmlFolder?: boolean;
  disableCssModuleExtension?: boolean;
  disableCssExtract?: boolean;
  enableCssModuleTSDeclaration?: boolean;
  disableMinimize?: boolean;
  enableInlineStyles?: boolean;
  enableInlineScripts?: boolean;
  disableSourceMap?: boolean;
  disableInlineRuntimeChunk?: boolean;
  disableAssetsCache?: boolean;
  enableLatestDecorators?: boolean;
  polyfill?: 'off' | 'usage' | 'entry' | 'ua';
  dataUriLimit?: number;
  templateParameters?: Record<string, unknown>;
  templateParametersByEntries?: Record<
    string,
    Record<string, unknown> | undefined
  >;
  cssModuleLocalIdentName?: string;
  enableModernMode?: boolean;
  federation?: boolean;
  disableNodePolyfill?: boolean;
  enableTsLoader?: boolean;

  /**
   * Disables lazy import support for styles, currently supports antd and arco-design.
   * The configuration of `output.disableAutoImportStyle` is provided by `unbundle` plugin.
   * Please use `yarn new` or `pnpm new` to enable the corresponding capability.
   * @requires `unbundle` plugin
   */
  disableAutoImportStyle?: boolean;

  /**
   * The configuration of `output.ssg` is provided by `ssg` plugin.
   * Please use `yarn new` or `pnpm new` to enable the corresponding capability.
   * @requires `ssg` plugin
   */
  ssg?: SSGConfig;
}

export interface ServerConfig {
  routes?: Record<
    string,
    | string
    | string[]
    | {
        route: string | string[];
        disableSpa?: boolean;
      }
  >;
  publicRoutes?: { [filepath: string]: string };
  ssr?: boolean | Record<string, unknown>;
  ssrByEntries?: Record<string, boolean | Record<string, unknown>>;
  baseUrl?: string | Array<string>;
  port?: number;
  logger?: boolean | Record<string, any>;
  metrics?: boolean | Record<string, any>;
  enableMicroFrontendDebug?: boolean;
  watchOptions?: WatchOptions;
}

export type DevProxyOptions = string | Record<string, string>;

export interface DevConfig {
  assetPrefix?: string | boolean;
  https?: boolean;

  /**
   * The configuration of `dev.proxy` is provided by `proxy` plugin.
   * Please use `yarn new` or `pnpm new` to enable the corresponding capability.
   * @requires `proxy` plugin
   */
  proxy?: DevProxyOptions;

  /**
   * The configuration of `dev.unbundle` is provided by `unbundle` plugin.
   * Please use `yarn new` or `pnpm new` to enable the corresponding capability.
   * @requires `unbundle` plugin
   */
  unbundle?: UnbundleConfig;
}

export interface MicroFrontend {
  enableHtmlEntry?: boolean;
  externalBasicLibrary?: boolean;
  moduleApp?: string;
}

export interface DeployConfig {
  microFrontend?: boolean | MicroFrontend;
  domain?: string | Array<string>;
  domainByEntries?: Record<string, string | Array<string>>;
}

type ConfigFunction =
  | Record<string, unknown>
  | ((
      config: Record<string, unknown>,
      // FIXME: utils type
      utils?: any,
    ) => Record<string, unknown> | void);

export type RequestHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction,
) => void;

export type DevServerConfig = {
  hot?: boolean;
  liveReload?: boolean;
  proxy?: BffProxyOptions;
  headers?: Record<string, string>;
  before?: RequestHandler[];
  after?: RequestHandler[];
  [propsName: string]: any;
};

export type PostCSSConfigUtils = {
  addPlugins: (plugins: PostCSSPlugin | PostCSSPlugin[]) => void;
};

export type PostCSSConfig =
  | PostCSSLoaderOptions
  | ((
      options: PostCSSLoaderOptions,
      utils: PostCSSConfigUtils,
    ) => PostCSSLoaderOptions | void);

export type WebpackConfigUtils = {
  env: string;
  name: string;
  webpack: typeof webpack;
  addRules: (rules: RuleSetRule | RuleSetRule[]) => void;
  prependPlugins: (
    plugins: WebpackPluginInstance | WebpackPluginInstance[],
  ) => void;
  appendPlugins: (
    plugins: WebpackPluginInstance | WebpackPluginInstance[],
  ) => void;
  removePlugin: (pluginName: string) => void;
  /**
   * @deprecated please use `tools.webpackChain` instead.
   */
  chain: WebpackChain;
};

export type WebpackConfig =
  | WebpackConfiguration
  | ((
      config: WebpackConfiguration,
      utils: WebpackConfigUtils,
    ) => WebpackConfiguration | void);

export type WebpackChainConfigUtils = {
  env: string;
  name: string;
  webpack: typeof webpack;
  CHAIN_ID: ChainIdentifier;
};

export type WebpackChainConfig = (
  chain: WebpackChain,
  utils: WebpackChainConfigUtils,
) => void;

export type TsLoaderConfigUtils = {
  addIncludes: (includes: string | RegExp | (string | RegExp)[]) => void;
  addExcludes: (excludes: string | RegExp | (string | RegExp)[]) => void;
};

export type TsLoaderConfig =
  | TsLoaderOptions
  | ((
      config: TsLoaderOptions,
      utils: TsLoaderConfigUtils,
    ) => TsLoaderOptions | void);

export type BabelConfigUtils = {
  addPlugins: (plugins: BabelPlugin[]) => void;
  addPresets: (presets: BabelPlugin[]) => void;
  addIncludes: (includes: string | RegExp | (string | RegExp)[]) => void;
  addExcludes: (excludes: string | RegExp | (string | RegExp)[]) => void;
  removePlugins: (plugins: string | string[]) => void;
  removePresets: (presets: string | string[]) => void;
};

export type BabelConfig =
  | TransformOptions
  | ((
      config: TransformOptions,
      utils: BabelConfigUtils,
    ) => TransformOptions | void);

export type AutoprefixerConfig =
  | AutoprefixerOptions
  | ((config: AutoprefixerOptions) => AutoprefixerOptions | void);

export type TerserConfig =
  | TerserOptions
  | ((config: TerserOptions) => TerserOptions | void);

export interface ToolsConfig {
  webpack?: WebpackConfig;
  webpackChain?: WebpackChainConfig;
  babel?: BabelConfig;
  autoprefixer?: AutoprefixerConfig;
  postcss?: PostCSSConfig;
  styledComponents?: ConfigFunction;
  lodash?: ConfigFunction;
  devServer?: DevServerConfig;
  tsLoader?: TsLoaderConfig;
  terser?: TerserConfig;
  minifyCss?: ConfigFunction;
  esbuild?: Record<string, unknown>;

  /**
   * The configuration of `tools.tailwindcss` is provided by `tailwindcss` plugin.
   * Please use `yarn new` or `pnpm new` to enable the corresponding capability.
   * @requires `tailwindcss` plugin
   */
  tailwindcss?:
    | Record<string, any>
    | ((options: Record<string, any>) => Record<string, any> | void);

  /**
   * The configuration of `tools.jest` is provided by `testing` plugin.
   * Please use `yarn new` or `pnpm new` to enable the corresponding capability.
   * @requires `testing` plugin
   */
  jest?: TestConfig['jest'];

  /**
   * The configuration of `tools.sass` is provided by `sass` plugin.
   * Please use `yarn new` or `pnpm new` to enable the corresponding capability.
   * @requires `sass` plugin
   */
  sass?: SassConfig;

  /**
   * The configuration of `tools.less` is provided by `less` plugin.
   * Please use `yarn new` or `pnpm new` to enable the corresponding capability.
   * @requires `less` plugin
   */
  less?: LessConfig;
}

export interface RuntimeConfig {
  [name: string]: any;
}

export interface RuntimeByEntriesConfig {
  [name: string]: RuntimeConfig;
}

export interface BffConfig {
  prefix?: string;
  requestCreator?: string;
  fetcher?: string;
  proxy?: Record<string, any>;
}

export interface UserConfig {
  source?: SourceConfig;
  output?: OutputConfig;
  server?: ServerConfig;
  dev?: DevConfig;
  deploy?: DeployConfig;
  tools?: ToolsConfig;
  plugins?: PluginConfig;
  runtime?: RuntimeConfig;
  runtimeByEntries?: RuntimeByEntriesConfig;

  /**
   * The configuration of `bff` is provided by `bff` plugin.
   * Please use `yarn new` or `pnpm new` to enable the corresponding capability.
   * @requires `bff` plugin
   */
  bff?: BffConfig;

  /**
   * The configuration of `testing` is provided by `testing` plugin.
   * Please use `yarn new` or `pnpm new` to enable the corresponding capability.
   * @requires `testing` plugin
   */
  testing?: TestConfig;

  /**
   * The configuration of `electron` is provided by `electron` plugin.
   * Please use `yarn new` or `pnpm new` to enable the corresponding capability.
   * @requires `electron` plugin
   */
  electron?: ElectronConfig;
  // eslint-disable-next-line max-lines
}

export type ConfigParam =
  | UserConfig
  | Promise<UserConfig>
  | ((env: any) => UserConfig | Promise<UserConfig>);

export interface LoadedConfig {
  config: UserConfig;
  filePath: string | false;
  dependencies: string[];
  pkgConfig: UserConfig;
  jsConfig: UserConfig;
}

export interface StyleOption {
  less?: LessOption;
  sass?: SassOption;
  postcss?: PostcssOption;
}

export interface ResolveStyleItemParams {
  file: string;
  projectDir: string;
  stylesDir: string;
  outDir: string;
  enableVirtualDist: boolean;
  options: StyleOption;
}

export type ResolveParams = Omit<ResolveStyleItemParams, 'file'> & {
  files: string[];
};

export type ProjectOption = Omit<ResolveStyleItemParams, 'file' | 'options'>;

export interface SingleFileStyleCompilerResult {
  code: number; // 0 success, 1 fail
  filename: string;
  content: string;
  error: string | null;
  sourceMapFileName?: string;
  sourceMap?: string;
}
