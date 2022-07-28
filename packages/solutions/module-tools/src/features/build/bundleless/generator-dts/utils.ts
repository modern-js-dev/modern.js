import * as path from 'path';
import { glob, fs, nanoid } from '@modern-js/utils';
import { merge as deepMerge } from '@modern-js/utils/lodash';
import type { NormalizedConfig } from '@modern-js/core';
import type { ITsconfig } from '../../../../types';
import { getFinalAlias } from '../../../../utils/babel';
import { transformDtsAlias } from '../../../../utils/tspaths-transform';

export interface IGeneratorConfig {
  appDirectory: string;
  sourceDir?: string;
  distDir: string;
  tsconfigPath?: string;
  tsCheck?: boolean;
  watch?: boolean;
}

export const generatorTsConfig = (
  projectTsconfig: ITsconfig,
  {
    appDirectory,
    distDir,
    sourceDir = 'src',
  }: { appDirectory: string; distDir: string; sourceDir?: string },
) => {
  const tempPath = path.resolve(appDirectory, './node_modules');
  const resolvePath = path.relative(tempPath, appDirectory);
  // const rootDir = projectTsconfig.compilerOptions?.rootDir
  //   ? path.join(resolvePath, projectTsconfig.compilerOptions?.rootDir)
  //   : resolvePath;
  // 目前限制 rootDir 的路径为 sourceDir
  const rootDir = path.join(resolvePath, sourceDir);
  const baseUrl = projectTsconfig.compilerOptions?.baseUrl
    ? path.join(appDirectory, projectTsconfig.compilerOptions?.baseUrl)
    : appDirectory;
  // if include = ['src'], final include should be ['../src']
  // const include = projectTsconfig.include?.map(includePath =>
  const include = [sourceDir]?.map(includePath =>
    path.join(resolvePath, includePath),
  );
  const exclude = projectTsconfig.exclude?.map(excludePath =>
    path.join(resolvePath, excludePath),
  );

  const resetConfig: ITsconfig = {
    compilerOptions: {
      rootDir,
      baseUrl,
      // Ensure that .d.ts files are created by tsc, but not .js files
      declaration: true,
      emitDeclarationOnly: true,
      outDir: distDir,
    },
    include,
    exclude,
  };

  const recommendOption = {
    // Ensure that Babel can safely transpile files in the TypeScript project
    compilerOptions: {
      isolatedModules: true,
    },
  };

  const tempTsconfigPath = path.join(
    tempPath,
    `tsconfig.${Date.now()}.${nanoid()}.json`,
  );
  fs.ensureFileSync(tempTsconfigPath);

  fs.writeJSONSync(
    tempTsconfigPath,
    deepMerge(
      recommendOption,
      projectTsconfig,
      // 此处是必须要覆盖用户默认配置
      resetConfig,
    ),
  );
  return tempTsconfigPath;
};

export const resolveAlias = (
  modernConfig: NormalizedConfig,
  config: IGeneratorConfig,
  watchFilenames: string[] = [],
) => {
  const { output } = modernConfig;
  const defaultPaths = { '@': ['./src'] };
  const dtsDistPath = `${config.distDir}/**/*.d.ts`;
  const dtsFilenames =
    watchFilenames.length > 0
      ? watchFilenames
      : glob.sync(dtsDistPath, { absolute: true });
  const alias = getFinalAlias(modernConfig, {
    appDirectory: config.appDirectory,
    tsconfigPath:
      config.tsconfigPath || path.join(config.appDirectory, './tsconfig.json'),
    sourceAbsDir: config.distDir,
  });
  const mergedPaths = alias.isTsPath
    ? alias.paths || {}
    : { ...defaultPaths, ...(alias.paths || {}) };
  const result = transformDtsAlias({
    filenames: dtsFilenames,
    baseUrl: path.join(config.appDirectory, output.path || 'dist'),
    paths: mergedPaths,
  });
  for (const r of result) {
    fs.writeFileSync(r.path, r.content);
  }
};

export const getTscBinPath = (appDirectory: string) => {
  const tscBinFile = path.join(appDirectory, './node_modules/.bin/tsc');

  if (!fs.existsSync(tscBinFile)) {
    throw new Error(
      'Failed to excute the `tsc` command, please check if `typescript` is installed correctly in the current directory.',
    );
  }

  return tscBinFile;
};
