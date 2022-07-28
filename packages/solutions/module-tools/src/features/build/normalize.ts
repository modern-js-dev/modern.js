/* eslint-disable max-lines */
import { lodash } from '@modern-js/utils';
import type { PluginAPI } from '@modern-js/core';
import { mergeWith } from '@modern-js/utils/lodash';
import type {
  BuildConfig,
  JsSyntaxType,
  BaseBuildConfig,
  SourceMap,
  BundlelessOptions,
  BundleOptions,
} from '../../schema/types';
import type { IBuildFeatOption } from '../../types';
import { cliTsConfigDefaultValue } from '../../utils/constants';
import type {
  NormalizedBuildConfig,
  NormalizedBundlelessBuildConfig,
} from './types';
import { unPresetConfigs, unPresetWithTargetConfigs } from './constants';
import { PACKAGE_MODES, DEFAULT_PACKAGE_MODE } from './legacy-constants';

export const getNormalizeModuleConfigByPackageModeAndFileds = (
  api: PluginAPI,
  buildFeatOption: IBuildFeatOption,
): BuildConfig => {
  const {
    output: { packageMode, packageFields, disableTsChecker, importStyle },
  } = api.useResolvedConfigContext();
  let configs: BuildConfig = [];

  if (buildFeatOption.styleOnly) {
    configs.push({
      buildType: 'bundleless',
      outputPath: './js/styles',
      bundlelessOptions: {
        sourceDir: './src',
        style: {
          compileMode:
            importStyle === 'source-code' ? 'only-source-code' : 'all',
        },
      },
    });
    configs.push({
      buildType: 'bundleless',
      outputPath: './styles',
      bundlelessOptions: {
        sourceDir: './styles',
        style: { compileMode: 'only-compiled-code' },
      },
    });
    return configs;
  }

  const commonConfig: BaseBuildConfig = {
    buildType: 'bundleless',
    bundlelessOptions: {
      sourceDir: './src',
      style: {
        path: '../styles',
        compileMode: false,
      },
      static: {
        path: '../styles',
      },
    },
    outputPath: './',
  };

  commonConfig.tsconfig = getFinalTsconfig(commonConfig, buildFeatOption);

  if (
    !packageFields ||
    (typeof packageFields === 'object' &&
      Object.keys(packageFields).length === 0)
  ) {
    const buildConfigs = PACKAGE_MODES[packageMode || DEFAULT_PACKAGE_MODE];
    configs = buildConfigs.map<NormalizedBundlelessBuildConfig>(config =>
      lodash.mergeWith({}, commonConfig, config),
    );
  } else {
    const getConfigsByJsSyntaxType = (
      js: JsSyntaxType,
      outputPath: string,
    ): NormalizedBuildConfig => {
      if (js === 'CJS+ES6') {
        return lodash.mergeWith({}, commonConfig, {
          format: 'cjs',
          target: 'es6',
          outputPath,
        });
      } else if (js === 'ESM+ES5') {
        return lodash.mergeWith({}, commonConfig, {
          format: 'esm',
          target: 'es5',
          outputPath,
        });
      }

      return lodash.mergeWith({}, commonConfig, {
        format: 'esm',
        target: 'es6',
        outputPath,
      });
    };
    if (
      !packageFields['jsnext:modern'] &&
      !packageFields.main &&
      !packageFields.module
    ) {
      throw new Error(
        `Unrecognized ${JSON.stringify(
          packageFields,
        )} configuration, please use keys: 'modern, main, jupiter:modern' and use values: 'CJS+ES6, ESM+ES5, ESM+ES6'`,
      );
    }
    // The fields configured in packageFields correspond to the main, module, and jsnext:modern fields on package.json,
    // and can also be used on package.json exports field.
    if (packageFields['jsnext:modern']) {
      configs.push(
        getConfigsByJsSyntaxType(packageFields['jsnext:modern'], 'js/modern'),
      );
    }

    if (packageFields.main) {
      configs.push(getConfigsByJsSyntaxType(packageFields.main, 'js/node'));
    }

    if (packageFields.module) {
      configs.push(
        getConfigsByJsSyntaxType(packageFields.module, 'js/treeshaking'),
      );
    }
  }

  if (configs.length > 0) {
    const firstConfig = configs[0] as NormalizedBundlelessBuildConfig;
    firstConfig.bundlelessOptions = lodash.mergeWith(
      {},
      firstConfig.bundlelessOptions,
      {
        style: {
          compileMode:
            importStyle === 'source-code' ? 'only-source-code' : 'all',
        },
      },
    );
  }

  // [compatibe mode]: dts gen
  if (buildFeatOption.legacyTsc && !disableTsChecker) {
    configs.push({
      buildType: 'bundleless',
      outputPath: './types',
      enableDts: true,
      dtsOnly: true,
    });
  }

  configs.push({
    buildType: 'bundleless',
    outputPath: './styles',
    bundlelessOptions: {
      sourceDir: './styles',
      style: { compileMode: 'only-compiled-code' },
    },
  });

  return configs;
};

export const getFinalTsconfig = (
  config: { tsconfig?: string },
  buildFeatOption: IBuildFeatOption,
) => {
  // cli tsconfig option > buildPreset tsconfig option

  // Since tsconfig configuration has default values,
  // compare the two to see if the user is configured with cli tsconfig
  if (buildFeatOption.tsconfigName !== cliTsConfigDefaultValue) {
    // TODO: transform tsconfig to absPath
    return buildFeatOption.tsconfigName;
  }
  return config.tsconfig ?? './tsconfig.json';
};
export const getFinalDts = (
  config: Pick<BaseBuildConfig, 'enableDts'>,
  buildFeatOption: IBuildFeatOption,
) => {
  // is js project, should return false
  if (!buildFeatOption.isTsProject) {
    return false;
  }
  // when `build --dts`, then all build tasks`s enableDts is true
  if (buildFeatOption.enableDtsGen) {
    return true;
  }

  return config.enableDts ?? false;
};
export const getSourceMap = (
  config: Pick<BaseBuildConfig, 'sourceMap'>,
  buildType: BaseBuildConfig['buildType'],
  api: PluginAPI,
): SourceMap => {
  // TODO: remove
  const {
    output: { disableSourceMap },
  } = api.useResolvedConfigContext();
  if (disableSourceMap) {
    return false;
  }

  if (config.sourceMap !== undefined) {
    return config.sourceMap;
  }

  return buildType === 'bundle';
};

export const normalizeBuildConfig = (
  context: { buildFeatOption: IBuildFeatOption; api: PluginAPI },
  buildConfig: BuildConfig,
  deps: string[] = [],
): NormalizedBuildConfig[] => {
  const { buildFeatOption, api } = context;
  const configArray = Array.isArray(buildConfig) ? buildConfig : [buildConfig];
  const normalizedModule: NormalizedBuildConfig[] = configArray.map(config => {
    const format = config.format ?? 'cjs';
    const target = config.target ?? 'esnext';
    const { bundleOptions } = config;
    const skipDeps = bundleOptions?.skipDeps ?? true;
    const externals =
      skipDeps === false
        ? bundleOptions?.externals || []
        : [
            ...deps.map(dep => new RegExp(`^${dep}($|\\/|\\\\)`)),
            ...(bundleOptions?.externals || []),
          ];
    const normalizedBundleOption: Required<BundleOptions> = {
      ...bundleOptions,
      entry: bundleOptions?.entry || {
        index: `src/index.${buildFeatOption.isTsProject ? 'ts' : 'js'}`,
      },
      platform: bundleOptions?.platform || 'node',
      minify: bundleOptions?.minify ?? false,
      externals,
      splitting: bundleOptions?.splitting ?? false,
      skipDeps,
    };
    const normalizedBundlelessOptions: Required<BundlelessOptions> = mergeWith(
      {},
      {
        sourceDir: './src',
        style: {
          compileMode: 'all',
          path: './',
        },
        static: { path: './' },
      },
      config.bundlelessOptions,
    );
    const watch = buildFeatOption.enableWatchMode || false;
    const tsconfig = getFinalTsconfig(config, buildFeatOption);
    const enableDts = getFinalDts(config, buildFeatOption);
    const outputPath = config.outputPath ?? './';
    const sourceMap = getSourceMap(config, config.buildType, api);
    const dtsOnly = config.dtsOnly ?? false;
    const commmonConfig = {
      format,
      target,
      watch,
      tsconfig,
      enableDts,
      outputPath,
      dtsOnly,
      sourceMap,
    };

    if (!buildFeatOption.isTsProject && (dtsOnly || enableDts)) {
      console.warn('[WARN] dtsOnly、enableDts 配置仅在 Ts 项目下生效');
    } else if (buildFeatOption.isTsProject && dtsOnly && !enableDts) {
      console.warn(
        '[WARN] dtsOnly 配置仅在 enableDts 为 true 的时候生效. 请检查当前的 dtsOnly、enableDts 是否配置正确',
      );
    }

    if (config.buildType === 'bundle') {
      return {
        ...commmonConfig,
        buildType: 'bundle',
        bundleOptions: normalizedBundleOption,
      };
    } else {
      return {
        ...commmonConfig,
        buildType: 'bundleless',
        bundlelessOptions: normalizedBundlelessOptions,
      };
    }
  });

  return normalizedModule;
};

export const normalizeModuleConfig = (context: {
  buildFeatOption: IBuildFeatOption;
  api: PluginAPI;
  deps?: string[];
}): NormalizedBuildConfig[] => {
  const { buildFeatOption, api, deps } = context;
  const {
    output: { buildConfig, buildPreset },
  } = api.useResolvedConfigContext();

  // buildConfig is the most important.
  if (buildConfig) {
    return normalizeBuildConfig(context, buildConfig, deps);
  }

  // buildPreset is the second important. It can be used when buildConfig is not defined.
  // buildPreset -> buildConfig
  if (buildPreset) {
    if (unPresetConfigs[buildPreset]) {
      return normalizeBuildConfig(context, unPresetConfigs[buildPreset], deps);
    } else if (unPresetWithTargetConfigs[buildPreset]) {
      return normalizeBuildConfig(
        context,
        unPresetWithTargetConfigs[buildPreset],
        deps,
      );
    }

    // If the buildPreset is not found, then it is used 'npm-library'
    // TODO: Warning: The buildPreset 'npm-library' is not supported.
    return normalizeBuildConfig(context, unPresetConfigs['npm-library'], deps);
  }

  // If the user does not configure buildConfig and buildPreset,
  // the configuration is generated based on packageMode and packageField
  const legacyBuildConfig = getNormalizeModuleConfigByPackageModeAndFileds(
    api,
    buildFeatOption,
  );
  return normalizeBuildConfig(context, legacyBuildConfig, deps);
};
/* eslint-enable max-lines */
