import { createPlugin, defineConfig, usePlugins, cli } from '@modern-js/core';
import { upath } from '@modern-js/utils';
import { lifecycle } from './lifecycle';
import { i18n, localeKeys } from './locale';
import { getLocaleLanguage } from './utils/language';
import { start } from './commands/start';
import { dev } from './commands/dev';

export { defineConfig };

// eslint-disable-next-line react-hooks/rules-of-hooks
usePlugins([
  upath.normalizeSafe(require.resolve('@modern-js/plugin-analyze/cli')),
  upath.normalizeSafe(require.resolve('@modern-js/plugin-fast-refresh/cli')),
  upath.normalizeSafe(require.resolve('@modern-js/plugin-polyfill/cli')),
]);

export default createPlugin(
  (() => {
    const locale = getLocaleLanguage();
    i18n.changeLanguage({ locale });

    lifecycle();

    return {
      commands({ program }: any) {
        program
          .command('dev')
          .usage('[options]')
          .description(i18n.t(localeKeys.command.dev.describe))
          .option('-c --config <config>', i18n.t(localeKeys.command.dev.config))
          .action(async () => {
            await dev();
          });

        program
          .command('build')
          .usage('[options]')
          .description(i18n.t(localeKeys.command.build.describe))
          .action(async () => {
            const { build } = await import('./commands/build');
            await build();
          });

        program
          .command('start')
          .usage('[options]')
          .description(i18n.t(localeKeys.command.start.describe))
          .action(async () => {
            await start();
          });

        program
          .command('new')
          .usage('[options]')
          .description(i18n.t(localeKeys.command.new.describe))
          .option('-d, --debug', i18n.t(localeKeys.command.new.debug), false)
          .option(
            '-c, --config <config>',
            i18n.t(localeKeys.command.new.config),
          )
          .option('--dist-tag <tag>', i18n.t(localeKeys.command.new.distTag))
          .option('--registry', i18n.t(localeKeys.command.new.registry))
          .action(async (options: any) => {
            const { MWANewAction } = await import('@modern-js/new-action');
            await MWANewAction({ ...options, locale });
          });
      },
      async fileChange() {
        // restart cli.
        const shouldRestart = await cli.restart();
        if (shouldRestart) {
          await dev();
        }
      },
    };
  }) as any,
  {
    post: [
      '@modern-js/plugin-analyze',
      '@modern-js/plugin-fast-refresh',
      '@modern-js/plugin-ssr',
      '@modern-js/plugin-state',
      '@modern-js/plugin-router',
      '@modern-js/plugin-polyfill',
    ],
  },
);
