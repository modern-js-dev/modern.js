import type { NormalizedConfig, SassOption } from '@modern-js/core';
import { sassResolve } from './compiler';
import { getSassLoaderOptions } from './options';

export const moduleSassConfig = ({
  modernConfig,
}: {
  modernConfig: NormalizedConfig;
}): SassOption => {
  const { options } = getSassLoaderOptions(modernConfig);
  return {
    ...(options.sassOptions || { file: '' }),
    sourceMap: options.sourceMap,
  };
};

export const moduleSassCompiler = () => {
  return sassResolve;
};
