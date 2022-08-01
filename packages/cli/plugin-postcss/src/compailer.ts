import path from 'path';
import {
  PostcssOption,
  ResolveStyleItemParams,
  SingleFileStyleCompilerResult,
} from '@modern-js/core';
import postcss, { AcceptedPlugin } from 'postcss';
import { likeCssLoaderPostCssPlugins } from './plugins';

export const postcssResolve = async (
  css: string,
  params: ResolveStyleItemParams,
  { sourcemapContent = '' }: { sourcemapContent?: string } = {},
) => {
  const { stylesDir, file, outDir, options } = params;
  const { postcss: userPostcssOption } = options;
  const from = file;
  const relativePath = path.relative(stylesDir, file);
  const to = path.join(outDir, relativePath);
  const config: PostcssOption = {
    plugins: [
      ...likeCssLoaderPostCssPlugins(file, userPostcssOption?.plugins || []),
    ],
    options: {
      from,
      to,
    },
  };

  let result = null;
  try {
    result = await postcss([
      ...(config.plugins as AcceptedPlugin[]),
      ...(userPostcssOption?.plugins || []),
    ]).process(css, {
      // not allow user to cover from and to attr
      from,
      to,
      map: userPostcssOption?.enableSourceMap
        ? {
            prev: sourcemapContent,
            inline: false,
          }
        : false,
      ...config.options,
      ...userPostcssOption?.options,
    });
  } catch (err: any) {
    return {
      code: 1,
      filename: to,
      content: '',
      error: err.message as string,
      sourceMap: '',
      sourceMapFileName: '',
    };
  }

  const compilerSuccessResult: SingleFileStyleCompilerResult = {
    code: 0,
    content: result.css,
    filename: to.replace(path.extname(to), '.css'),
    error: null,
    sourceMap: '',
    sourceMapFileName: '',
  };
  if (result.map) {
    compilerSuccessResult.sourceMapFileName = `${to}.map`;
    compilerSuccessResult.sourceMap = result.map.toString();
  }
  return compilerSuccessResult;
};
