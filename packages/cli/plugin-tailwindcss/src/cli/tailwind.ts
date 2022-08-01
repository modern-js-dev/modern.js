import type { NormalizedConfig } from '@modern-js/core';
import { applyOptionsChain, logger } from '@modern-js/utils';
import { merge, cloneDeep } from '@modern-js/utils/lodash';

const checkIfExistNotAllowKeys = (
  tailwindConfig: Record<string, any>,
): [boolean, string] => {
  const notAllowExistKeys = ['theme'];
  let notAllowKey = '';

  const ret = Object.keys(tailwindConfig).some(
    key => notAllowExistKeys.includes(key) && (notAllowKey = key),
  );

  return [ret, notAllowKey];
};

const getPureDesignSystemConfig = (
  designSystemConfig: Record<string, any> & {
    supportStyledComponents?: boolean;
  },
) => {
  const pureDesignSystemConfig = cloneDeep(designSystemConfig);
  delete pureDesignSystemConfig.supportStyledComponents;
  return pureDesignSystemConfig;
};

const getTailwindConfig = (
  config: NormalizedConfig,
  option: { pureConfig?: Record<string, any> } = {},
) => {
  const purgeConfig = merge(
    {
      // TODO: how the operating environment is determined
      enabled: process.env.NODE_ENV === 'production',
      // TODO: Remove or not
      layers: ['utilities'],
      content: [],
    },
    option.pureConfig || {},
  );
  const defaultTailwindConfig = {
    purge: purgeConfig,
  };
  const tailwindConfig = applyOptionsChain(
    defaultTailwindConfig,
    config.tools.tailwindcss || {},
  );

  const designSystem = getPureDesignSystemConfig(
    (config.source as any).designSystem || {},
  );

  const [exist, key] = checkIfExistNotAllowKeys(tailwindConfig);

  if (exist) {
    logger.error(
      `should not exist '${key}' on tools.tailwindcss, please remove it`,
    );
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  }

  // Because there is no default theme configuration
  tailwindConfig.theme = designSystem || {};

  return tailwindConfig;
};

export { getTailwindConfig };
