import * as os from 'os';
import path from 'path';
import type { NormalizedConfig } from '@modern-js/core';
import type { PostcssOption } from '@modern-js/style-compiler';
import { chalk, Import, fs } from '@modern-js/utils';
import { clearFlag } from './constants';

const cssConfig: typeof import('@modern-js/css-config') = Import.lazy(
  '@modern-js/css-config',
  require,
);

/**
 * 处理日志信息
 */
export class LogStack {
  private _codeLogStack: string[];

  constructor() {
    this._codeLogStack = [];
  }

  update(latestLog: string, { splitEOL = false } = {}) {
    if (splitEOL) {
      latestLog.split(os.EOL).forEach(log => {
        this._codeLogStack.unshift(log.trim());
      });
      return;
    }

    this._codeLogStack.unshift(latestLog.trim());
  }

  clear() {
    this._codeLogStack = [];
  }

  get value() {
    return [...new Set(this._codeLogStack)];
  }
}

export const logTemplate = (
  title: string,
  messageStack: string[],
  maxLength: number,
  {
    noBottomBorder = false,
    bottomBorderText = '',
    noLeftBorder = false,
    leftBorder = '│',
    contentColor = (s: string) => s,
  } = {},
) => {
  const leftBorderFlag = noLeftBorder ? '' : leftBorder;
  const messageFragments = messageStack
    .map(p => {
      p.trim();

      return `${leftBorderFlag}${p.replace(clearFlag, '')}`;
    }) // 移除 clearFlag
    .slice(0, maxLength) // 控制长度
    .filter(s => s !== leftBorderFlag) // 过滤空字符串
    .reverse(); // 调换顺序，最新的消息在最后面
  const template = `${title}:
${contentColor(messageFragments.join(os.EOL))}${
    noBottomBorder ? '' : `\n${bottomBorderText}`
  }`;
  return template;
};
export enum SectionTitleStatus {
  Success,
  Fail,
  Log,
}
export const watchSectionTitle = (str: string, status: SectionTitleStatus) => {
  if (status === SectionTitleStatus.Success) {
    return `${chalk.bgWhite.gray.underline(str)} ${chalk.green.underline(
      'Successful',
    )}`;
  } else if (status === SectionTitleStatus.Fail) {
    return `${chalk.bgWhite.gray.underline(str)} ${chalk.red.underline(
      'Build Failed',
    )}`;
  }

  return `${chalk.bgWhite.gray.underline(str)} ${chalk.blue.underline('Log')}`;
};

export const getPostcssOption = (
  appDirectory: string,
  modernConfig: NormalizedConfig,
): PostcssOption => {
  const postcssOption = cssConfig.getPostcssConfig(
    appDirectory,
    modernConfig,
    false,
  );
  return {
    plugins: postcssOption?.postcssOptions?.plugins || [],
    enableSourceMap: (postcssOption as any)?.sourceMap || false,
    options: {},
  };
};

export const getAllDeps = <T>(appDirectory: string) => {
  try {
    const json = JSON.parse(
      fs.readFileSync(path.resolve(appDirectory, './package.json'), 'utf8'),
    );

    // return json[packageJsonConfig ?? PACKAGE_JSON_CONFIG_NAME] as T | undefined;
    return [
      ...Object.keys((json.dependencies as T | undefined) || {}),
      ...Object.keys((json.devDependencies as T | undefined) || {}),
      ...Object.keys((json.peerDependencies as T | undefined) || {}),
    ];
  } catch (e) {
    console.warn('[WARN] package.json is broken');
    return [];
  }
};
