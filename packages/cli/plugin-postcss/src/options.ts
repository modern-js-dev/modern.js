import type { NormalizedConfig, PostcssOption } from '@modern-js/core';
import { applyOptionsChain, getBrowserslist, isProd } from '@modern-js/utils';
import type { ProcessOptions, AcceptedPlugin } from 'postcss';
import { shouldUseSourceMap } from './util';

export const getPostcssOption = (
  appDirectory: string,
  modernConfig: NormalizedConfig,
): PostcssOption => {
  const postcssOption = getPostcssConfig(appDirectory, modernConfig, false);
  return {
    plugins: postcssOption?.postcssOptions?.plugins || [],
    enableSourceMap: (postcssOption as any)?.sourceMap || false,
    options: {},
  };
};

/**
 *
 * @param autoprefixer - Enable autoprefixer config.
 * @returns Base PostCSS config options for app or library.
 */
export const getPostcssConfig = (
  appDirectory: string,
  config: NormalizedConfig,
  autoprefixer = true,
) => {
  const extraPlugins: AcceptedPlugin[] = [];

  const utils = {
    addPlugins(plugins: AcceptedPlugin | AcceptedPlugin[]) {
      if (Array.isArray(plugins)) {
        extraPlugins.push(...plugins);
      } else {
        extraPlugins.push(plugins);
      }
    },
  };

  const enableCssMinify = config.output?.disableCssExtract && isProd();

  const mergedConfig = applyOptionsChain(
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
            ? require('../compiled/autoprefixer')(
                applyOptionsChain(
                  {
                    flexbox: 'no-2009',
                    overrideBrowserslist: getBrowserslist(appDirectory),
                  },
                  config.tools?.autoprefixer,
                ),
              )
            : false,
          enableCssMinify ? require('cssnano')({ preset: 'default' }) : false,
        ].filter(Boolean),
      },
      sourceMap: shouldUseSourceMap(config),
    },
    config.tools?.postcss || {},
    utils,
  );

  if (extraPlugins.length) {
    mergedConfig.postcssOptions!.plugins!.push(...extraPlugins);
  }

  return mergedConfig as ProcessOptions & {
    postcssOptions: {
      plugins?: AcceptedPlugin[];
    };
  };
};
