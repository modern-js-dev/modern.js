import { fs } from '@modern-js/utils';
import ChangesetPlugin from '@modern-js/plugin-changeset';
import LintPlugin from '@modern-js/plugin-jarvis';
import type { CliPlugin } from '@modern-js/core';
import { hooks } from './hooks';
import { devCli, buildCli, newCli } from './cli';
import { i18n } from './locale';
import { addSchema } from './schema';
import { getLocaleLanguage } from './utils/language';

export * from './types';

export { defineConfig } from '@modern-js/core';

const isBuildMode = process.argv.slice(2)[0] === 'build';

export default (): CliPlugin => ({
  name: '@modern-js/module-tools',

  post: ['@modern-js/plugin-changeset'],

  registerHook: hooks,

  usePlugins: isBuildMode ? [] : [ChangesetPlugin(), LintPlugin()],

  setup: api => {
    const locale = getLocaleLanguage();
    i18n.changeLanguage({ locale });
    return {
      // copy from @modern-js/app-tools/src/analyze/index.ts
      async prepare() {
        const appContext = api.useAppContext();
        const hookRunners = api.useHookRunners();

        try {
          fs.emptydirSync(appContext.internalDirectory);
        } catch {
          // FIXME:
        }

        await hookRunners.addRuntimeExports();
      },
      validateSchema() {
        return addSchema();
      },
      config() {
        return {
          output: {
            enableSourceMap: false,
            jsPath: 'js',
          },
        };
      },
      commands({ program }) {
        devCli(program, api);
        buildCli(program, api);
        newCli(program, locale);

        // 便于其他插件辨别
        program.$$libraryName = 'module-tools';
      },
    };
  },
});
