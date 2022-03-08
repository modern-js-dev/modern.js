import path from 'path';
import {
  createRuntimeExportsUtils,
  getEntryOptions,
  PLUGIN_SCHEMAS,
} from '@modern-js/utils';
import {
  createPlugin,
  useAppContext,
  useResolvedConfigContext,
} from '@modern-js/core';
import type WebpackChain from 'webpack-chain';
import { logger } from '../util';
import {
  getRuntimeConfig,
  makeProvider,
  makeRenderFunction,
  setRuntimeConfig,
} from './utils';

export const webpackConfigCallback = (
  webpackConfig: any,
  {
    chain,
    webpack,
    env = process.env.NODE_ENV || 'development',
  }: { chain: WebpackChain; webpack: any; env: string },
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const resolvedConfig = useResolvedConfigContext();

  if (resolvedConfig?.deploy?.microFrontend) {
    chain.output.libraryTarget('umd');

    if (resolvedConfig?.server?.port) {
      chain.output.publicPath(
        env === 'development'
          ? `//localhost:${resolvedConfig.server.port}/`
          : webpackConfig.output.publicPath,
      );
    }

    // add comments avoid sourcemap abnormal
    if (webpack.BannerPlugin) {
      chain
        .plugin('banner')
        .use(webpack.BannerPlugin, [{ banner: 'Micro front-end' }]);
    }

    const { enableHtmlEntry = true, externalBasicLibrary = false } =
      typeof resolvedConfig?.deploy?.microFrontend === 'object'
        ? resolvedConfig?.deploy?.microFrontend
        : {};

    // external
    if (externalBasicLibrary) {
      chain.externals(externals);
    }
    // use html mode
    if (!enableHtmlEntry) {
      chain.output.filename('index.js');
      chain.plugins.delete('html-main');
      chain.optimization.runtimeChunk(false);
      chain.optimization.splitChunks({
        chunks: 'async',
      });
    }
  }

  const resolveWebpackConfig = chain.toConfig();
  logger('webpackConfig', {
    output: resolveWebpackConfig.output,
    externals: resolveWebpackConfig.externals,
    env,
    alias: resolveWebpackConfig.resolve?.alias,
  });
};

export const externals = { 'react-dom': 'react-dom', react: 'react' };

type Initializer = Parameters<typeof createPlugin>[0];
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
type NonVoidPromiseAble<T> = T extends void | Promise<any> ? never : T;
export type LifeCycle = NonVoidPromiseAble<ReturnType<Initializer>>;

export const resolvedConfig: NonNullable<
  LifeCycle['resolvedConfig']
> = async config => {
  const { resolved } = config;
  const { masterApp, router } = getRuntimeConfig(resolved);

  const nConfig = {
    resolved: {
      ...resolved,
    },
  };

  if (masterApp) {
    // basename does not exist use router's basename
    setRuntimeConfig(
      nConfig.resolved,
      'masterApp',
      Object.assign(typeof masterApp === 'object' ? { ...masterApp } : {}, {
        basename: router?.historyOptions?.basename || '/',
      }),
    );
  }

  logger(`resolvedConfig`, {
    runtime: nConfig.resolved.runtime,
    deploy: nConfig.resolved.deploy,
    server: nConfig.resolved.server,
  });
  return nConfig;
};

export const initializer: (
  hooks: {
    resolvedConfig: LifeCycle['resolvedConfig'];
    validateSchema: LifeCycle['validateSchema'];
  },
  initializerConfig: {
    runtimePluginName?: string;
  },
) => Initializer =
  (
    // eslint-disable-next-line @typescript-eslint/no-shadow
    { resolvedConfig, validateSchema },
    { runtimePluginName = '@modern-js/runtime/plugins' },
  ) =>
  () => {
    const configMap = new Map<string, any>();
    let pluginsExportsUtils: ReturnType<typeof createRuntimeExportsUtils>;

    let runtimeExportsUtils: ReturnType<typeof createRuntimeExportsUtils>;

    return {
      validateSchema,
      resolvedConfig,
      config() {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const config = useAppContext();

        pluginsExportsUtils = createRuntimeExportsUtils(
          config.internalDirectory,
          'plugins',
        );

        runtimeExportsUtils = createRuntimeExportsUtils(
          config.internalDirectory,
          'index',
        );

        return {
          source: {
            alias: {
              '@modern-js/runtime/plugins': pluginsExportsUtils.getPath(),
            },
          },
          tools: {
            webpack: webpackConfigCallback,
          },
        };
      },
      addRuntimeExports() {
        const mfPackage = path.resolve(__dirname, '../../../../');
        const addExportStatement = `export { default as garfish, default as masterApp } from '${mfPackage}'`;
        logger('exportStatement', addExportStatement);
        pluginsExportsUtils.addExport(addExportStatement);

        runtimeExportsUtils.addExport(`export * from '${mfPackage}'`);
      },
      modifyEntryImports({ entrypoint, imports }: any) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const config = useResolvedConfigContext();
        // support legacy config
        const { masterApp } = getRuntimeConfig(config);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { packageName } = useAppContext();

        const masterAppConfig = getEntryOptions(
          entrypoint.entryName,
          masterApp,
          config.runtimeByEntries,
          packageName,
        );

        configMap.set(entrypoint.entryName, masterAppConfig);

        if (masterAppConfig) {
          imports.push({
            value: runtimePluginName,
            specifiers: [
              {
                imported: 'garfish',
              },
            ],
          });
          imports.push({
            value: runtimePluginName,
            specifiers: [
              {
                imported: 'masterApp',
              },
            ],
          });
        }

        imports.push({
          value: 'react-dom',
          specifiers: [
            {
              imported: 'unmountComponentAtNode',
            },
            {
              imported: 'createPortal',
            },
          ],
        });

        return { imports, entrypoint };
      },
      modifyEntryRuntimePlugins({ entrypoint, plugins }: any) {
        const masterAppConfig = configMap.get(entrypoint.entryName);

        if (masterAppConfig) {
          logger('garfishPlugin options', masterAppConfig);

          plugins.push({
            name: 'garfish',
            args: 'masterApp',
            options:
              masterAppConfig === true
                ? JSON.stringify({})
                : JSON.stringify(masterAppConfig),
          });
        }
        return { entrypoint, plugins };
      },
      modifyEntryRenderFunction({ entrypoint, code }: any) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const config = useResolvedConfigContext();

        if (!config?.deploy?.microFrontend) {
          return { entrypoint, code };
        }
        const nCode = makeRenderFunction(code);
        logger('makeRenderFunction', nCode);
        return {
          entrypoint,
          code: nCode,
        };
      },
      modifyEntryExport({ entrypoint, exportStatement }: any) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const config = useResolvedConfigContext();
        if (config?.deploy?.microFrontend) {
          const exportStatementCode = makeProvider();
          logger('exportStatement', exportStatementCode);
          return {
            entrypoint,
            exportStatement: exportStatementCode,
          };
        }

        return {
          entrypoint,
          exportStatement,
        };
      },
    };
  };

export default createPlugin(
  initializer(
    {
      resolvedConfig,
      validateSchema() {
        return PLUGIN_SCHEMAS['@modern-js/plugin-garfish'];
      },
    },
    {
      runtimePluginName: '@modern-js/runtime/plugins',
    },
  ),
  {
    name: '@modern-js/plugin-garfish',
  },
);
