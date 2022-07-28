import { Command } from '@modern-js/utils';
import type { PluginAPI } from '@modern-js/core';
import type { IBuildCommandOption } from '../commands/build';
import { i18n, localeKeys } from '../locale';
import { build } from '../commands/build';

export const buildCli = (program: Command, api: PluginAPI) => {
  return (
    program
      .command('build')
      .usage('[options]')
      .description(i18n.t(localeKeys.command.build.describe))
      .option('-w, --watch', i18n.t(localeKeys.command.build.watch))
      .option(
        '--tsconfig [tsconfig]',
        i18n.t(localeKeys.command.build.tsconfig),
        './tsconfig.json',
      )
      .option('--style-only', i18n.t(localeKeys.command.build.style_only))
      .option(
        '-p, --platform [platform]',
        i18n.t(localeKeys.command.build.platform),
      )
      // @deprecated
      // The `--no-tsc` option has been superceded by the `--no-dts` option.
      .option('--no-tsc', i18n.t(localeKeys.command.build.no_tsc))
      .option('--dts', i18n.t(localeKeys.command.build.dts))
      .option('--no-clear', i18n.t(localeKeys.command.build.no_clear))
      .option('-c --config <config>', i18n.t(localeKeys.command.build.config))
      .action(async (subCommand: IBuildCommandOption) => {
        await build(api, subCommand);
      })
  );
};
