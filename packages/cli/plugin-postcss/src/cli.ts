import { Import } from '@modern-js/utils';
import type { CliPlugin } from '@modern-js/core';

const mlc: typeof import('./module-postcss-config') = Import.lazy(
  './module-postcss-config',
  require,
);

const SASS_REGEX = /\.s(a|c)ss$/;
const SASS_MODULE_REGEX = /\.module\.s(a|c)ss$/;
const NODE_MODULES_REGEX = /node_modules/;

export const isNodeModulesSass = (path: string) =>
  NODE_MODULES_REGEX.test(path) &&
  SASS_REGEX.test(path) &&
  !SASS_MODULE_REGEX.test(path);

export default (): CliPlugin => ({
  name: '@modern-js/plugin-postcss',

  setup: () => ({
    validateSchema: () => {
      return [];
    },
    modulePostcssConfig: mlc.modulePostcssConfig,
    modulePostcssCompiler: mlc.modulePostcssCompiler,
  }),
});
