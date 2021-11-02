import type { NormalizedConfig } from '@modern-js/core';
import { fs, Import, path } from '@modern-js/utils';
import { STORYBOOK_TEMPLATE_DIR } from '../constants';

const template: typeof import('lodash.template') = Import.lazy(
  'lodash.template',
  require,
);

const INTERPOLATE_REGPEXP = /<%=([\s\S]+?)%>/g;

export type MainOptions = {
  appDirectory: string;
  disableTsChecker: boolean;
  stories: string[];
  isTsProject: boolean;
};

const MAIN_TEMPLATE = path.join(STORYBOOK_TEMPLATE_DIR, 'main.tmpl');

export const generateMain = (options: MainOptions) => {
  const mainTemplate = fs.readFileSync(MAIN_TEMPLATE, 'utf-8');
  const injects: Record<string, string> = {
    appDirectory: options.appDirectory,
    disableTsChecker: String(options.disableTsChecker),
    stories: JSON.stringify(options.stories),
    isTsProject: String(options.isTsProject),
  };
  const execute = template(mainTemplate, { interpolate: INTERPOLATE_REGPEXP });
  return execute(injects);
};

export type PreviewOptions = {
  userPreviewPath?: string;
  runtime: NormalizedConfig['runtime'];
  designToken: Record<string, any>;
};

const PREVIEW_TEMPLATE = path.join(STORYBOOK_TEMPLATE_DIR, 'preview.tmpl');

export const generatePreview = (options: PreviewOptions) => {
  const previewTemplate = fs.readFileSync(PREVIEW_TEMPLATE, 'utf-8');
  const injects: Record<string, string> = {
    userPreviewPath: options.userPreviewPath || '',
    runtime: JSON.stringify(options.runtime || {}),
    designToken: JSON.stringify(options.designToken),
  };
  const execute = template(previewTemplate, {
    interpolate: INTERPOLATE_REGPEXP,
  });
  return execute(injects);
};
