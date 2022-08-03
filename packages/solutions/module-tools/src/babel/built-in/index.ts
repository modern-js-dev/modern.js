import { createBabelChain } from '@modern-js/babel-preset-lib';
import type { BuiltInOptsType } from '../types';

export const getBuildInPlugins = (opts: BuiltInOptsType) => {
  const chain = createBabelChain();
  chain
    .plugin('@modern-js/babel-plugin-import-path')
    .use(require.resolve('./import-path'), [opts]);

  return chain;
};
