import * as path from 'path';
import type { Stats } from 'fs';
import { fs, dotenv, globby, slash } from '@modern-js/utils';
import type { PluginAPI } from '@modern-js/core';
import onExit from 'signal-exit';
import type { Platform } from '../types';
import { existTsConfigFile } from '../utils/tsconfig';
import { valideBeforeTask } from '../utils/valide';
import { build as buildFeature } from '../features/build';

/**
 * init work before build task.
 * @param api
 */
export const init = (api: PluginAPI): void => {
  const { appDirectory } = api.useAppContext();

  dotenv.config();

  onExit(async code => {
    if (code === 0) {
      return;
    }
    const tempTsconfigPathPattern = path.join(
      appDirectory,
      './node_modules',
      `./tsconfig.**.**.json`,
    );
    const files = globby(slash(tempTsconfigPathPattern), {
      stats: true,
      absolute: true,
    }) as unknown as { stats: Stats; path: string }[];
    const currentTime = Date.now();
    for (const file of files) {
      // over 30s, will delete it
      if (currentTime - file.stats.birthtimeMs >= 30 * 1000) {
        fs.unlinkSync(file.path);
      }
    }
  });
};

export interface IBuildCommandOption {
  watch?: boolean;
  tsconfig: string;
  platform?: boolean | Exclude<Platform, 'all'>;
  styleOnly?: boolean;
  // @deprecated
  // The `tsc` field has been superceded by the `dts` field.
  tsc: boolean;
  dts?: boolean;
  clear: boolean;
}

export const build = async (
  api: PluginAPI,
  buildCommandOption: IBuildCommandOption,
) => {
  const {
    watch = false,
    tsconfig: tsconfigName,
    tsc,
    dts = false,
    clear,
    platform = false,
    styleOnly = false,
  } = buildCommandOption;

  init(api);

  const { appDirectory } = api.useAppContext();
  const modernConfig = api.useResolvedConfigContext();
  const tsconfigPath = path.join(appDirectory, tsconfigName);
  const outputPath = modernConfig.output.path ?? 'dist';
  const isTsProject = existTsConfigFile(tsconfigPath);
  const enableDtsGen = isTsProject && dts;

  valideBeforeTask({ modernConfig, tsconfigPath });

  await buildFeature(api, {
    enableWatchMode: watch,
    enableDtsGen,
    isTsProject,
    tsconfigName,
    outputPath,
    styleOnly,
    platform,
    clear,
    legacyTsc: tsc,
  });
};
