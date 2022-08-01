import { NormalizedConfig, PostcssOption } from '@modern-js/core';
import { postcssResolve } from './compailer';
import { getPostcssOption } from './options';

export const modulePostcssConfig = ({
  modernConfig,
  appDirectory,
}: {
  modernConfig: NormalizedConfig;
  appDirectory: string;
}): PostcssOption => {
  return getPostcssOption(appDirectory, modernConfig);
};

export const modulePostcssCompiler = () => {
  return postcssResolve;
};
