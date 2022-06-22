import path from 'path';
import { globby } from '@modern-js/utils';
import { MaybeAsync } from '@modern-js/bff-runtime';
import { INDEX_SUFFIX } from './constants';

export type NormalHandler = (...args: any[]) => any;
export type Handler<I, O> = (input: I) => MaybeAsync<O>;

export const getFiles = (
  lambdaDir: string,
  rules: string | string[],
): string[] =>
  globby
    .sync(rules, {
      cwd: lambdaDir,
      gitignore: true,
    } as any)
    .map(file => path.resolve(lambdaDir, file as any));

export const getPathFromFilename = (
  baseDir: string,
  filename: string,
): string => {
  const relativeName = filename.substring(baseDir.length);
  const relativePath = relativeName.split('.').slice(0, -1).join('.');

  const nameSplit = relativePath.split(path.sep).map(item => {
    if (item.length > 2) {
      if (item.startsWith('[') && item.endsWith(']')) {
        return `:${item.substring(1, item.length - 1)}`;
      }
    }

    return item;
  });

  const name = nameSplit.join('/');

  const finalName = name.endsWith(INDEX_SUFFIX)
    ? name.substring(0, name.length - INDEX_SUFFIX.length)
    : name;

  return clearRouteName(finalName);
};

const clearRouteName = (routeName: string): string => {
  let finalRouteName = routeName.trim();

  if (!finalRouteName.startsWith('/')) {
    finalRouteName = `/${finalRouteName}`;
  }

  if (finalRouteName.length > 1 && finalRouteName.endsWith('/')) {
    finalRouteName = finalRouteName.substring(0, finalRouteName.length - 1);
  }

  return finalRouteName;
};

export const isHandler = (input: any): input is Handler<any, any> =>
  input && typeof input === 'function';

export const requireHandlerModule = (modulePath: string) => {
  const requiredModule = require(modulePath);
  if (requiredModule.__esModule && requiredModule.default) {
    return requiredModule.default;
  }
  return requiredModule;
};
