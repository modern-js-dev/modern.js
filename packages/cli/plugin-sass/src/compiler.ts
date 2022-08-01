import path from 'path';
import { fs } from '@modern-js/utils';
import sass from 'sass';
import { toString, merge } from '@modern-js/utils/lodash';
import {
  ResolveStyleItemParams,
  SingleFileStyleCompilerResult,
} from '@modern-js/core';

const sassToCss = (
  sassCode: string,
  params: ResolveStyleItemParams,
  { outFile }: { outFile: string },
) => {
  const { file, options } = params;
  const ext = path.extname(file);
  const enableIndentedSyntax = ext === '.sass';
  const config = {
    file,
    data: sassCode,
    indentedSyntax: enableIndentedSyntax,
    outFile,
  };
  const sassConfig = merge(config, options.sass);

  try {
    const sassResult = sass.renderSync(sassConfig);
    return {
      code: 0,
      content: sassResult.css.toString(),
      filename: outFile,
      error: null,
      sourceMap: toString(sassResult.map),
    } as SingleFileStyleCompilerResult;
  } catch (error: any) {
    return {
      code: 1,
      content: '',
      filename: outFile,
      error: error.message,
    } as SingleFileStyleCompilerResult;
  }
};

const generateContent = async (
  sassCode: string,
  params: ResolveStyleItemParams,
  option: { outFile: string },
) => {
  return sassToCss(sassCode, params, option);
};

export const sassResolve = async (params: ResolveStyleItemParams) => {
  const { file, stylesDir, outDir } = params;
  const originSassCode = fs.readFileSync(file, 'utf-8');
  const relativePath = path.relative(stylesDir, file);
  const outFile = path.join(outDir, relativePath);
  return generateContent(originSassCode, params, { outFile });
};
