import path from 'path';
import type { ChildProcess } from 'child_process';
import { execa, fs, json5 } from '@modern-js/utils';
import type { NormalizedConfig, PluginAPI } from '@modern-js/core';
import type { NormalizedBundlelessBuildConfig } from '../../types';
import type { ITsconfig } from '../../../../types';
import { InternalDTSError } from '../../error';
import { SectionTitleStatus, watchSectionTitle } from '../../utils';
import {
  getTscBinPath,
  IGeneratorConfig,
  generatorTsConfig,
  resolveAlias,
} from './utils';

const getProjectTsconfig = (tsconfigPath: string | undefined): ITsconfig => {
  if (!tsconfigPath || !fs.existsSync(tsconfigPath)) {
    return {};
  }

  return json5.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
};

const resolveLog = (childProgress: ChildProcess, { watch = false } = {}) => {
  /**
   * tsc 所有的log信息都是从stdout data 事件中获取
   * 正常模式下，如果有报错信息，交给 resolveLog 后面的逻辑来处理
   * watch 模式下，则使用这里的信息
   */
  childProgress.stdout?.on('data', data => {
    if (watch) {
      console.info(
        watchSectionTitle('[Bundleless:DTS]', SectionTitleStatus.Log),
      );
      console.info(data.toString());
    }
  });
  // 正常以下内容都不会触发，因为tsc 不会产生以下类型的log信息，不过防止意外情况
  childProgress.stdout?.on('error', error => {
    console.error(error.message);
  });
  childProgress.stderr?.on('data', chunk => {
    console.error(chunk.toString());
  });
};

const generatorDts = async (_: NormalizedConfig, config: IGeneratorConfig) => {
  const {
    tsconfigPath,
    distDir,
    sourceDir = 'src',
    appDirectory,
    watch = false,
  } = config;

  const userTsconfig = getProjectTsconfig(tsconfigPath);
  const willDeleteTsconfigPath = generatorTsConfig(userTsconfig, {
    appDirectory,
    distDir,
    sourceDir,
  });
  const tscBinFile = getTscBinPath(appDirectory);

  const watchParams = watch ? ['-w'] : [];
  const childProgress = execa(
    tscBinFile,
    [
      '-p',
      willDeleteTsconfigPath,
      /* Required parameter, use it stdout have color */
      '--pretty',
      // https://github.com/microsoft/TypeScript/issues/21824
      '--preserveWatchOutput',
      ...watchParams,
    ],
    {
      stdio: 'pipe',
      cwd: appDirectory,
    },
  );
  resolveLog(childProgress, { watch });
  try {
    await childProgress;
  } catch (e) {
    if (e instanceof Error) {
      throw new InternalDTSError(e, {
        buildType: 'bundleless',
      });
    }
  }
  fs.removeSync(willDeleteTsconfigPath);
};

export const genDts = async (
  api: PluginAPI,
  config: NormalizedBundlelessBuildConfig,
) => {
  const {
    outputPath,
    tsconfig: tsconfigPath,
    watch,
    bundlelessOptions: { sourceDir },
    enableDts,
  } = config;
  if (!enableDts) {
    return;
  }
  const { appDirectory } = api.useAppContext();
  const modernConfig = api.useResolvedConfigContext();
  const {
    output: { path: distPath = 'dist' },
  } = modernConfig;
  const distDir = path.join(appDirectory, distPath, outputPath);

  const option = {
    appDirectory,
    distDir,
    tsconfigPath,
    watch,
    sourceDir,
  };
  await generatorDts(modernConfig, option);
  // TODO: watch 模式下无法转换
  resolveAlias(modernConfig, option);
};
