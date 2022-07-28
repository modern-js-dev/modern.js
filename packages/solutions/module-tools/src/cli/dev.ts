import { Command } from '@modern-js/utils';
import type { PluginAPI } from '@modern-js/core';
import type { IDevOption } from '../commands/dev';
import { i18n, localeKeys } from '../locale';
import { dev } from '../commands/dev';

export const devCli = (program: Command, api: PluginAPI) => {
  program
    .command('dev [subCmd]')
    .usage('[options]')
    .description(i18n.t(localeKeys.command.dev.describe))
    .option(
      '--tsconfig [tsconfig]',
      i18n.t(localeKeys.command.build.tsconfig),
      './tsconfig.json',
    )
    .action(async (subCmd: string, params: IDevOption) => {
      await dev(api, params, subCmd);
    });
};
