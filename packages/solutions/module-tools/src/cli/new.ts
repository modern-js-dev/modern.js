import { Import, Command } from '@modern-js/utils';
import { i18n, localeKeys } from '../locale';

const newAction: typeof import('@modern-js/new-action') = Import.lazy(
  '@modern-js/new-action',
  require,
);

export const newCli = (program: Command, locale?: string) => {
  program
    .command('new')
    .usage('[options]')
    .description(i18n.t(localeKeys.command.new.describe))
    .option('-d, --debug', i18n.t(localeKeys.command.new.debug), false)
    .option('-c, --config <config>', i18n.t(localeKeys.command.new.config))
    .option('--dist-tag <tag>', i18n.t(localeKeys.command.new.distTag))
    .option('--registry', i18n.t(localeKeys.command.new.registry))
    .action(async options => {
      await newAction.ModuleNewAction({ ...options, locale });
    });
};
