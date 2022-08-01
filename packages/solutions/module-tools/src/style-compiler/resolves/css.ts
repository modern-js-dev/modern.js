import { fs } from '@modern-js/utils';
import { PostcssCompilerItem, ResolveItemParams } from '../types';

export const cssResolve = async (
  params: ResolveItemParams,
  postcssResolve: PostcssCompilerItem,
) => {
  const { file } = params;
  const originalCss = fs.readFileSync(file, 'utf-8');
  return postcssResolve(originalCss, params);
};
