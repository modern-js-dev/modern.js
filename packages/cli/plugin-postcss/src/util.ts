import { isProd } from '@modern-js/utils';
import type { NormalizedConfig } from '@modern-js/core';

export const shouldUseSourceMap = (config: NormalizedConfig) =>
  isProd() && !config.output.disableSourceMap;
