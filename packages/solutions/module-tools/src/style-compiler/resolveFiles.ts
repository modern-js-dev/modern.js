import { fs } from '@modern-js/utils';
import { ResolveStyleItemParams } from '@modern-js/core';
import { cssResolve } from './resolves/css';
import {
  ResolveParams,
  SingleFileCompilerResult,
  ICompilerResult,
} from './types';
import { isCssRule, isLessRule, isSassRule } from './utils/cssRule';
import { generateOutputFile } from './resolves/utils';

export async function resolveFiles(
  params: ResolveParams & { enableVirtualDist: true },
): Promise<ICompilerResult>;
export async function resolveFiles(
  params: ResolveParams & { enableVirtualDist: false },
): Promise<undefined>;

export async function resolveFiles(params: ResolveParams) {
  const { files, enableVirtualDist, compiler, options } = params;

  const results: SingleFileCompilerResult[] = [];
  for (const file of files) {
    let result: SingleFileCompilerResult;
    const postcssResolve = compiler.postcss;
    // 不做任何处理结果
    const noHandleResult = {
      code: 0,
      filename: file,
      content: fs.readFileSync(file, 'utf-8'),
      error: null,
    };
    const handlePostcssResolve = (
      result: SingleFileCompilerResult,
      params: ResolveStyleItemParams,
    ) => {
      if (postcssResolve) {
        return postcssResolve(result.content, params, {
          sourcemapContent: result.sourceMap!,
        });
      }
      return noHandleResult;
    };
    if (isLessRule(file) && options.less) {
      const lessResolve = compiler.less;
      if (lessResolve) {
        result = await lessResolve({ file, ...params });
        if (result.code !== 1) {
          result = await handlePostcssResolve(result, { file, ...params });
        }
      } else {
        result = noHandleResult;
      }
    } else if (isSassRule(file) && options.sass) {
      const sassResolve = compiler.sass;
      if (sassResolve) {
        result = await sassResolve({ file, ...params });
        if (result.code !== 1) {
          result = await handlePostcssResolve(result, { file, ...params });
        }
      } else {
        result = noHandleResult;
      }
    } else if (isCssRule(file) && postcssResolve) {
      result = await cssResolve({ file, ...params }, postcssResolve);
    } else {
      result = noHandleResult;
    }

    results.push(result);
    if (!enableVirtualDist && result.code === 0) {
      generateOutputFile(result.filename, result.content, params);
    }
  }

  if (enableVirtualDist) {
    return {
      code: results.some(result => result.code === 1) ? 1 : 0,
      dists: results.filter(result => result.code === 0),
      errors: results.filter(result => result.code === 1),
    };
  }

  return undefined;
}
