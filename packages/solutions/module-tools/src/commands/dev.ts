import * as path from 'path';
import { dotenv } from '@modern-js/utils';
import type { PluginAPI } from '@modern-js/core';
import { runSubCmd, showMenu, devStorybook } from '../features/dev';
import { existTsConfigFile } from '../utils/tsconfig';
import { valideBeforeTask } from '../utils/valide';

export interface IDevOption {
  tsconfig: string;
}

const existSubCmd = (subCmd: string) => subCmd.length > 0;

export const dev = async (api: PluginAPI, option: IDevOption, subCmd = '') => {
  const { tsconfig: tsconfigName } = option;
  const appContext = api.useAppContext();
  const modernConfig = api.useResolvedConfigContext();
  const { appDirectory } = appContext;
  const tsconfigPath = path.join(appDirectory, tsconfigName);

  dotenv.config();

  valideBeforeTask({ modernConfig, tsconfigPath });

  const isTsProject = existTsConfigFile(tsconfigPath);

  if (existSubCmd(subCmd)) {
    await runSubCmd(api, subCmd, { isTsProject, appDirectory });
    return;
  }

  // Compatible with the use of jupiter, RUN_PLATFORM is used in jupiter
  if (process.env.RUN_PLATFORM) {
    await showMenu(api, { isTsProject, appDirectory });
  } else {
    await devStorybook(api, { isTsProject, appDirectory });
  }
};
