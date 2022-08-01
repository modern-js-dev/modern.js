import type { NormalizedConfig, LessOption } from '@modern-js/core';
import NpmImportPlugin from 'less-plugin-npm-import';
import { getLessLoaderOptions } from './options';
import { lessResolve } from './compiler';

export const moduleLessConfig = ({
  modernConfig,
  npmImportPrefix = '~',
}: {
  modernConfig: NormalizedConfig;
  npmImportPrefix?: string;
}): LessOption => {
  const { options } = getLessLoaderOptions(modernConfig);

  return {
    enableSourceMap: options.sourceMap || false,
    lessOption: {
      ...options.lessOptions,
      plugins: [
        new NpmImportPlugin({ prefix: npmImportPrefix }),
        ...(options.lessOptions?.plugins || []),
      ],
    },
  };
};

export const moduleLessCompiler = () => {
  return lessResolve;
};
