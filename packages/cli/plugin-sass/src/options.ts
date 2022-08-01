import type { NormalizedConfig, SassLoaderOptions } from '@modern-js/core';
import { applyOptionsChain } from '@modern-js/utils';

export const getSassLoaderOptions = (
  config: NormalizedConfig,
  options: SassLoaderOptions = {},
) => {
  const excludes: RegExp[] = [];

  const addExcludes = (items: RegExp | RegExp[]) => {
    if (Array.isArray(items)) {
      excludes.push(...items);
    } else {
      excludes.push(items);
    }
  };

  const mergedOptions = applyOptionsChain(
    {
      sourceMap: false,
      ...options,
    },
    config.tools.sass || {},
    { addExcludes },
  );

  return {
    options: mergedOptions,
    excludes,
  };
};
