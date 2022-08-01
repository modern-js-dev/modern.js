import path from 'path';
import { fs } from '@modern-js/utils';
import less from 'less';
import {
  ResolveStyleItemParams,
  SingleFileStyleCompilerResult,
} from '@modern-js/core';

const lessToCss = async (lessCode: string, params: ResolveStyleItemParams) => {
  const { file, options } = params;

  const data = lessCode.replace(/^\uFEFF/, '');
  const sourceMapOptions = {
    outputFilename: `${file}.map`,
    outputSourceFiles: true,
  };
  try {
    const lessResult = await less.render(data, {
      // [rootPath] https://lesscss.org/usage/#less-options-rootpath
      // TODO: support any path and url
      rootpath: './',
      relativeUrls: true,
      filename: path.resolve(file),
      paths: [path.dirname(file)],
      sourceMap: options.less?.enableSourceMap ? sourceMapOptions : false,
      ...options.less?.lessOption,
    } as Less.Options);
    return {
      code: 0,
      filename: file,
      content: lessResult.css,
      error: null,
      sourceMap: lessResult.map,
      sourceMapFileName: '',
    };
  } catch (error: any) {
    return {
      code: 1,
      filename: file,
      content: '',
      error: error.message,
    };
  }
};

const generateContent = async (
  lessCode: string,
  params: ResolveStyleItemParams,
) => {
  const lessCompilerResult = await lessToCss(lessCode, params);

  return lessCompilerResult as SingleFileStyleCompilerResult;
};

export const lessResolve = async (params: ResolveStyleItemParams) => {
  const { file } = params;
  const originalLessCode = fs.readFileSync(file, 'utf-8');

  return generateContent(originalLessCode, params);
};
