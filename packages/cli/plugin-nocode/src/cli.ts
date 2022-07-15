import { join } from 'path';
import { PLUGIN_SCHEMAS } from '@modern-js/utils';
import { WebpackConfigTarget, getWebpackConfig } from '@modern-js/webpack';
import AnalyzePlugin from '@modern-js/plugin-analyze';
import type { CliPlugin } from '@modern-js/core';
import type { Configuration } from 'webpack';
import { MODE, STARRY_MODEL_RUNTIME } from './contants';
import dev from './dev';
import { register } from './register';

process.env.RUN_PLATFORM = 'true';

const getMode = (appDirectory: string) => {
  let mode = MODE.BLOCK;
  try {
    const { dependencies } = require(join(appDirectory, 'package.json'));
    if (STARRY_MODEL_RUNTIME in dependencies) {
      mode = MODE.MODEL;
    }
  } catch (err) {}
  return mode;
};

export default (): CliPlugin => ({
  name: '@modern-js/plugin-nocode',
  usePlugins: [AnalyzePlugin()],
  setup: api => ({
    commands({ program }) {
      program
        .command('deploy [subcmd]')
        .usage('[option]')
        .description('发布区块')
        .option('--token <token>', 'use pre-authorized token')
        .option('--auto-push', 'auto push tag')
        .action(async (subCmd: string, options: Record<string, any>) => {
          if (subCmd === 'register') {
            await register(appDirectory, modernConfig, options);
          } else if (subCmd === 'unregister') {
            await register(appDirectory, modernConfig, options, 'unregister');
          }
        });

      const devCommand = program.commandsMap.get('dev');
      const appContext = api.useAppContext();
      const { appDirectory, internalDirectory } = appContext;
      const modernConfig = api.useResolvedConfigContext();
      if (devCommand) {
        devCommand.command('nocode').action(async () => {
          const webpackConfig = getWebpackConfig(
            WebpackConfigTarget.CLIENT,
            appContext,
            modernConfig,
          ) as Configuration;
          await dev(
            appDirectory,
            internalDirectory,
            webpackConfig,
            modernConfig,
            getMode(appDirectory),
          );
        });
      }
    },
    validateSchema() {
      return PLUGIN_SCHEMAS['@modern-js/plugin-nocode'];
    },
    platformBuild() {
      return {
        name: 'nocode',
        title: 'Run Nocode log',
        taskPath: require.resolve('./build-task'),
        params: [],
      };
    },
    moduleToolsMenu() {
      return {
        name: 'nocode 调试',
        value: 'nocode',
        runTask: async ({
          isTsProject: _ = false,
        }: {
          isTsProject: boolean;
        }) => {
          const appContext = api.useAppContext();
          const { appDirectory, internalDirectory } = appContext;
          const modernConfig = api.useResolvedConfigContext();
          const webpackConfig = getWebpackConfig(
            WebpackConfigTarget.CLIENT,
            appContext,
            modernConfig,
          ) as Configuration;
          await dev(
            appDirectory,
            internalDirectory,
            webpackConfig,
            modernConfig,
            getMode(appDirectory),
          );
        },
      };
    },
  }),
});
