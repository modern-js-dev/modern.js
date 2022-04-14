import { logger, chalk } from '@modern-js/utils';
import type { PluginAPI } from '@modern-js/core';
import server from '@modern-js/prod-server';
import { printInstructions } from '../utils/printInstructions';

export const start = async (api: PluginAPI) => {
  const appContext = api.useAppContext();
  const userConfig = api.useResolvedConfigContext();

  const { appDirectory, port, serverConfigFile } = appContext;

  logger.log(chalk.cyan(`Starting the modern server...`));

  const app = await server({
    pwd: appDirectory,
    config: userConfig,
    plugins: appContext.plugins
      .filter((p: any) => p.server)
      .map((p: any) => p.server),
    serverConfigFile,
  });

  app.listen(port, async (err: Error) => {
    if (err) {
      throw err;
    }
    await printInstructions(api, appContext, userConfig);
  });
};
