import path from 'path';
import { SpeedyBundler } from '@speedy-js/speedy-core';
import { es5InputPlugin } from '@speedy-js/speedy-plugin-es5';
import type { CLIConfig, SpeedyPlugin } from '@speedy-js/speedy-types';
import type { PluginAPI } from '@modern-js/core';
import { applyOptionsChain, ensureAbsolutePath } from '@modern-js/utils';
import type { NormalizedBundleBuildConfig } from '../types';
import { InternalBuildError } from '../error';
import { SectionTitleStatus, watchSectionTitle } from '../utils';

export type ResolveAlias = { [index: string]: string };
export const getAlias = (api: PluginAPI) => {
  const { appDirectory, srcDirectory } = api.useAppContext();
  const { source } = api.useResolvedConfigContext();
  // TODO: maybe check tsconfig `paths`
  const defaultAlias = {
    '@': srcDirectory,
  };

  const alias = applyOptionsChain<ResolveAlias, undefined>(
    defaultAlias,
    source?.alias as ResolveAlias,
  );

  return Object.keys(alias).reduce((o, name) => {
    return {
      ...o,
      [name]: ensureAbsolutePath(appDirectory, alias[name]),
    };
  }, {});
};
export const getDefine = (api: PluginAPI) => {
  const {
    source: { envVars, globalVars },
  } = api.useResolvedConfigContext();
  const envVarsDefine = [...(envVars || [])].reduce<Record<string, string>>(
    (memo, name) => {
      memo[`process.env.${name}`] = JSON.stringify(process.env[name]);
      return memo;
    },
    {},
  );
  const globalVarsDefine = Object.keys(globalVars || {}).reduce<
    Record<string, string>
  >((memo, name) => {
    memo[name] = globalVars ? JSON.stringify(globalVars[name]) : '';
    return memo;
  }, {});

  return {
    ...envVarsDefine,
    ...globalVarsDefine,
  };
};

const getStyleOptionFromModern = async (api: PluginAPI) => {
  const runner = api.useHookRunners();
  const { appDirectory } = api.useAppContext();
  const modernConfig = api.useResolvedConfigContext();
  const lessOption = await runner.moduleLessConfig(
    { modernConfig },
    { onLast: async (_: any) => undefined },
  );
  const sassOption = await runner.moduleSassConfig(
    { modernConfig },
    { onLast: async (_: any) => undefined },
  );
  const tailwindPlugin = await runner.moduleTailwindConfig(
    { modernConfig },
    { onLast: async (_: any) => undefined },
  );
  const postcssOption = await runner.modulePostcssConfig(
    { modernConfig, appDirectory },
    { onLast: async (_: any) => undefined },
  );
  if (tailwindPlugin) {
    postcssOption?.plugins?.push(tailwindPlugin);
  }
  return {
    less: lessOption?.lessOption,
    sass: sassOption,
    postcss: {
      ...postcssOption?.options,
      plugins: postcssOption?.plugins,
    },
  };
};

export const runSpeedy = async (
  api: PluginAPI,
  config: NormalizedBundleBuildConfig,
) => {
  const { appDirectory } = api.useAppContext();
  const {
    output: { path: distPath = 'dist' },
    tools: { speedy: userSpeedyConfig },
  } = api.useResolvedConfigContext();
  const { target, watch, bundleOptions, outputPath, format, sourceMap } =
    config;
  const { entry, platform, splitting, minify, externals } = bundleOptions;
  const distDir = path.join(appDirectory, distPath, outputPath);
  const titleText = `[Bundle:Speedy:${format}_${target}]`;
  const style = await getStyleOptionFromModern(api);
  const alias = getAlias(api);
  const define = getDefine(api);
  const watchPlugin = (): SpeedyPlugin => {
    return {
      name: 'watch-plugin',
      apply(compiler) {
        compiler.hooks.watchChange.tap('watch-plugin', async () => {
          console.info(watchSectionTitle(titleText, SectionTitleStatus.Log));
        });
      },
    };
  };
  const plugins = target === 'es5' ? [es5InputPlugin()] : [];
  plugins.push(watchPlugin());
  // TODO: add speedy plugin about react
  const internalSpeedyConfig: CLIConfig = {
    command: 'build',
    mode: 'production',
    html: false,
    preset: 'webapp', // support css and json
    platform,
    watch,
    input: entry,
    target,
    clearScreen: false,
    output: {
      path: distDir,
      format,
      splitting,
      filename: '[name]',
    },
    style,
    resolve: { alias },
    define,
    sourceMap,
    minify,
    external: externals,
    plugins,
  };
  const speedyConfig = applyOptionsChain(
    internalSpeedyConfig,
    userSpeedyConfig,
  );
  const compiler = await SpeedyBundler.create(speedyConfig);
  try {
    if (watch) {
      console.info(watchSectionTitle(titleText, SectionTitleStatus.Log));
    }
    await compiler.build();
  } catch (e) {
    /**
     * in watch mode
     * use speedy watch log
     */
    if (e instanceof Error) {
      throw new InternalBuildError(e, {
        target,
        format,
        buildType: 'bundle',
      });
    }
  }
};
