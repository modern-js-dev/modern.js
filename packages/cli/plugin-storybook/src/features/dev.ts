import { Import } from '@modern-js/utils';
import type { NormalizedConfig } from '@modern-js/core';
import { valid } from './utils/valid';

const core: typeof import('@modern-js/core') = Import.lazy(
  '@modern-js/core',
  require,
);
const storybook: typeof import('@storybook/react/standalone') = Import.lazy(
  '@storybook/react/standalone',
  require,
);
const constants: typeof import('./constants') = Import.lazy(
  './constants',
  require,
);
const gen: typeof import('./utils/genConfigDir') = Import.lazy(
  './utils/genConfigDir',
  require,
);
const webpackConfig: typeof import('./utils/webpackConfig') = Import.lazy(
  './utils/webpackConfig',
  require,
);

export interface IRunDevOption {
  isTsProject?: boolean;
  stories: string[];
}

export const runDev = async ({
  isTsProject = false,
  stories,
}: IRunDevOption) => {
  const appContext = core.useAppContext();
  const modernConfig = core.useResolvedConfigContext();
  const { appDirectory, port = constants.STORYBOOK_PORT } = appContext;
  const {
    dev: { disableTsChecker = false },
  } = modernConfig as NormalizedConfig & {
    dev: {
      disableTsChecker?: boolean;
    }; // TODO: 使用 module-tools 提供的完整类型
  };

  if (!valid({ stories })) {
    return;
  }

  const configDir = await gen.generateConfig(appDirectory, {
    disableTsChecker,
    preview: true,
    isTsProject,
    stories,
    // TODO: 运行runtime相关功能的时候再处理
    modernConfig,
  });

  const handleWebpack = webpackConfig.getCustomWebpackConfigHandle({
    modernConfig,
    appContext,
    configDir,
    isTsProject,
    env: 'dev',
  });
  // NB: must set NODE_ENV
  process.env.NODE_ENV = 'development';

  storybook({
    ci: true,
    mode: 'dev',
    port,
    configDir,
    customFinalWebpack: handleWebpack,
  });
};
