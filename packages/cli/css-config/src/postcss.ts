import type { NormalizedConfig } from '@modern-js/core';
import { applyOptionsChain, getBrowserslist } from '@modern-js/utils';
import type { ProcessOptions, AcceptedPlugin } from 'postcss';
import { shouldUseSourceMap } from './util';

/**
 *
 * @param autoprefixer - Enable autoprefixer config.
 * @returns Base PostCSS config options for app or library.
 */
export const getPostcssConfig = (
  appDirectory: string,
  config: NormalizedConfig,
  autoprefixer = true,
): ProcessOptions & {
  postcssOptions: {
    plugins?: AcceptedPlugin[];
  };
} =>
  applyOptionsChain(
    {
      postcssOptions: {
        plugins: [
          require('../compiled/postcss-flexbugs-fixes'),
          require('../compiled/postcss-custom-properties'),
          require('../compiled/postcss-initial'),
          require('../compiled/postcss-page-break'),
          require('../compiled/postcss-font-variant'),
          require('../compiled/postcss-media-minmax'),
          require('../compiled/postcss-nesting'),
          autoprefixer
            ? require('autoprefixer')(
                applyOptionsChain(
                  {
                    flexbox: 'no-2009',
                    overrideBrowserslist: getBrowserslist(appDirectory),
                  },
                  config.tools?.autoprefixer,
                ),
              )
            : false,
        ].filter(Boolean),
      },
      sourceMap: shouldUseSourceMap(config),
    },
    config.tools?.postcss,
  ) as any;
