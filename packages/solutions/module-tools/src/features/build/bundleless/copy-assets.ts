import * as path from 'path';
import { fs, watch, glob, WatchChangeType } from '@modern-js/utils';
import type { PluginAPI } from '@modern-js/core';
import { NormalizedBundlelessBuildConfig } from '../types';
import { copyTask } from '../../../utils/copy';

const SRC_DIRS = 'src';

const copyAssets = ({
  targetDir,
  outputDir,
}: {
  targetDir: string;
  outputDir: string;
}) => {
  const assetsFiles = glob.sync(`${targetDir}/**/*.*`, {
    ignore: ['**/*.{js,jsx,ts,tsx,d.ts,scss,less,css,sass}'],
  });

  if (assetsFiles.length > 0) {
    fs.ensureDirSync(outputDir);
  }

  for (const resource of assetsFiles) {
    const file = path.relative(targetDir, resource);
    fs.ensureDirSync(path.dirname(path.resolve(outputDir, file)));
    fs.copyFileSync(resource, path.resolve(outputDir, file));
  }
};

const watchAssets = (
  api: PluginAPI,
  {
    targetDir,
    outputDir,
  }: {
    targetDir: string;
    outputDir: string;
  },
) => {
  const appContext = api.useAppContext();
  const modernConfig = api.useResolvedConfigContext();
  watch(
    `${targetDir}/**/*.*`,
    async ({ changeType, changedFilePath }) => {
      if (changeType === WatchChangeType.UNLINK) {
        const removeFile = path.normalize(
          `${outputDir}/${path.relative(targetDir, changedFilePath)}`,
        );
        fs.removeSync(removeFile);
        return;
      }
      const file = path.relative(targetDir, changedFilePath);
      fs.copyFileSync(changedFilePath, path.resolve(outputDir, file));
      await copyTask({ modernConfig, appContext });
    },
    ['**/*.{js,jsx,ts,tsx,d.ts,scss,less,css,sass}'],
  );
};

export const copyStaticAssets = async (
  api: PluginAPI,
  config: NormalizedBundlelessBuildConfig,
) => {
  const appContext = api.useAppContext();
  const modernConfig = api.useResolvedConfigContext();
  const { appDirectory } = appContext;
  const { path: distPath = 'dist' } = modernConfig.output;
  const { outputPath, bundlelessOptions } = config;
  const { static: { path: staticPath = './' } = { path: './' } } =
    bundlelessOptions;
  const srcDir = path.join(
    appDirectory,
    bundlelessOptions.sourceDir ?? SRC_DIRS,
  );
  const outputDirToSrc = path.join(
    appDirectory,
    distPath,
    outputPath,
    staticPath,
  );
  copyAssets({ targetDir: srcDir, outputDir: outputDirToSrc });
  await copyTask({ modernConfig, appContext });

  if (config.watch) {
    watchAssets(api, { targetDir: srcDir, outputDir: outputDirToSrc });
  }
};
