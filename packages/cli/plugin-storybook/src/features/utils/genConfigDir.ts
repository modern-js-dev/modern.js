import * as path from 'path';
import type { NormalizedConfig } from '@modern-js/core';
import { Import, fs, HIDE_MODERN_JS_DIR } from '@modern-js/utils';

const glob: typeof import('glob') = Import.lazy('glob', require);
const constants: typeof import('../constants') = Import.lazy(
  '../constants',
  require,
);
const gen: typeof import('./generate') = Import.lazy('./generate', require);

export type GenerateOptions = {
  disableTsChecker: boolean;
  preview: boolean;
  modernConfig: NormalizedConfig;
  stories: string[];
  isTsProject: boolean;
};

const defaultOptions = {
  disableTsChecker: false,
  preview: false,
  stories: [],
  isTsProject: false,
};

const getConfigDir = (appDir: string) => {
  const moduleToolsPath = path.resolve(appDir, HIDE_MODERN_JS_DIR);
  fs.ensureDirSync(moduleToolsPath);
  return path.resolve(moduleToolsPath, constants.STORYBOOK_CONFIG_PATH);
};

export const generateConfig = async (
  appDirectory: string,
  customeOptions: Partial<GenerateOptions> = {},
) => {
  const options = { ...defaultOptions, ...customeOptions };
  const {
    disableTsChecker,
    preview,
    stories,
    modernConfig = {},
    isTsProject,
  } = options;
  const userConfigDir = path.resolve(
    appDirectory,
    constants.STORYBOOK_USER_CONFIG_PATH,
  );
  const configDir = getConfigDir(appDirectory);
  const existUserConfig = await checkExistUserConfig(appDirectory);

  await initStoryBookDir(configDir);
  if (existUserConfig) {
    await copyOtherFile(userConfigDir, configDir);
    await checkMainFile(
      path.resolve(appDirectory, constants.STORYBOOK_USER_CONFIG_PATH),
    );
  }
  await genMainFile(appDirectory, {
    disableTsChecker,
    configDir,
    stories,
    isTsProject,
  });

  if (preview) {
    await genPreviewFile(
      appDirectory,
      modernConfig as NormalizedConfig,
      configDir,
    );
  }

  return configDir;
};

const existUserPreviewFile = (filename: string) => {
  const ret = glob.sync(`${filename}.@(js|jsx|ts|tsx)`);

  return ret.length > 0;
};

const genPreviewFile = async (
  appDirectory: string,
  modernConfig: NormalizedConfig,
  configDir: string,
) => {
  const previewPath = path.join(appDirectory, '/config/storybook/preview');
  const isExistPreview = existUserPreviewFile(previewPath);
  const previewContent = gen.generatePreview({
    runtime: modernConfig.runtime,
    designToken: {},
    userPreviewPath: isExistPreview ? previewPath : undefined,
  });
  const previewFile = path.resolve(configDir, 'preview.js');
  await fs.outputFile(previewFile, previewContent, { encoding: 'utf8' });
};

const checkExistUserConfig = (appDirectory: string) =>
  fs.pathExists(
    path.resolve(appDirectory, constants.STORYBOOK_USER_CONFIG_PATH),
  );

const initStoryBookDir = async (configDir: string) => {
  await fs.remove(configDir);
  await fs.ensureDir(configDir);
};

const copyOtherFile = (userConfigDir: string, configDir: string) =>
  fs.copy(userConfigDir, configDir);

const checkMainFile = async (storybookUserConfigPath: string) => {
  const blacklist = ['webpackFinal', 'babel', 'stories'];
  const dir = path.resolve(storybookUserConfigPath, 'main.js');
  const exist = await fs.pathExists(dir);
  if (exist) {
    const userMainConfig = require(dir);
    const keys = Object.keys(userMainConfig);
    const errorKeys = keys.filter(key => blacklist.includes(key));
    // TODO 确定这里的判断逻辑
    if (errorKeys.length > 0) {
      console.warn(
        `config/storybook/main.js 中不应该存在 ${errorKeys.join(
          ', ',
        )}配置，请在 modern.config.js 中的 tools.webpack进行配置`,
      );
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }
  }
};

const genMainFile = async (
  appDirectory: string,
  options: {
    disableTsChecker: boolean;
    configDir: string;
    stories: string[];
    isTsProject: boolean;
  },
) => {
  const { disableTsChecker, configDir, stories, isTsProject = false } = options;
  const mainContent = gen.generateMain({
    appDirectory,
    disableTsChecker,
    stories,
    isTsProject,
  });
  const mainFile = path.resolve(configDir, 'main.js');
  await fs.outputFile(mainFile, mainContent, { encoding: 'utf8' });
};
