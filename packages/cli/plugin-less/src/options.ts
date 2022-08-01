import type { NormalizedConfig, LessLoaderOptions } from '@modern-js/core';
import { applyOptionsChain } from '@modern-js/utils';

export const getLessLoaderOptions = (
  config: NormalizedConfig,
  options: LessLoaderOptions = {},
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
      lessOptions: { javascriptEnabled: true },
      sourceMap: false,
      ...options,
    },
    config.tools.less || {},
    { addExcludes },
  );

  return {
    options: mergedOptions,
    excludes,
  };
};
