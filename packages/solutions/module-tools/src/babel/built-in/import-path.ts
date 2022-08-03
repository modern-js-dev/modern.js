import path from 'path';
import { fs, slash } from '@modern-js/utils';
import { types as t } from '@babel/core';
import type { NodePath, PluginPass, PluginObj } from '@babel/core';
import type { BuiltInOptsType } from '../types';

let replaceValueHash: Record<string, string> = {};

export const getImportFileDistPath = (
  // importName is index.less or demo.png
  importName: string,
  currentFilename: string,
  opts: Pick<BuiltInOptsType, 'staticDir' | 'styleDir' | 'sourceDir'>,
) => {
  const { staticDir = '.', styleDir = '.' } = opts;
  const currentFileDir = path.dirname(currentFilename);
  // NB: REL means 'relative'
  // NB: opts.sourceDir is a absolute path
  const crtFileRELSrcPath = path.relative(
    currentFileDir,
    opts.sourceDir ?? currentFileDir,
  );
  const importFileRELSrcPath = path.relative(
    opts.sourceDir ?? currentFileDir,
    path.join(currentFileDir, importName),
  );
  const resourceDir = isStyleFile(importName) ? styleDir : staticDir;
  // crtFileRELSrcPath: Relative path of the current file to the source directory
  // resourceDir: styleDir or staticDir
  // importFileRELPath: Relative path of the import file (eg: index.less or demo.png) to the source directory
  const ret = path.join(crtFileRELSrcPath, resourceDir, importFileRELSrcPath);
  return ret.startsWith('.') ? slash(ret) : slash(`./${ret}`);
};
/**
 * when the file suffix is not '.js', '.jsx', '.ts', '.tsx', return true;
 * @param file
 * @param filename The filename is the file currently being compiled
 * @returns
 */
export const isNotJsLikeFile = (
  importFileName: string,
  currentCompileFile: string,
) => {
  const tests: [RegExp, string][] = [
    [/\.js$/, '.js'],
    [/\.jsx$/, '.jsx'],
    [/\.ts$/, '.ts'],
    [/\.tsx$/, '.tsx'],
  ];

  // check this file is static file
  // by string and determine if the file with the added suffix exists
  return !tests.some(
    ([regex, prefix]) =>
      regex.test(importFileName) ||
      fs.existsSync(
        path.join(path.dirname(currentCompileFile), importFileName) + prefix,
      ) ||
      fs.existsSync(
        path.join(path.dirname(currentCompileFile), importFileName, 'index') +
          prefix,
      ),
  );
};

export const isStyleFile = (file: string) => {
  const tests = [/\.css$/, /\.less$/, /\.sass$/, /\.scss$/];

  return tests.some(regex => regex.test(file));
};

/**
 * Skip the following cases:
 * + import 'xxx'
 * + import './a.js'.
 * + import './a' and a is js file
 */
export const isShouldSkip = (importName: string, filename: string) => {
  if (importName.startsWith('./') || importName.startsWith('../')) {
    if (isNotJsLikeFile(importName, filename)) {
      return false;
    }
  }

  return true;
};

export const getReplacePath = (
  opts: BuiltInOptsType,
  importName?: string,
  currentFilename?: string | null,
) => {
  const { importStyle } = opts;
  if (!currentFilename || !importName) {
    return '';
  }

  if (isShouldSkip(importName, currentFilename)) {
    return '';
  }

  let realFilepath = getImportFileDistPath(importName, currentFilename, opts);
  if (isStyleFile(realFilepath) && importStyle === 'compiled-code') {
    realFilepath = realFilepath.replace(/\.(less|sass|scss)$/, '.css');
  }

  return realFilepath;
};

const importPath = (): PluginObj => ({
  name: 'import-path',
  pre() {
    replaceValueHash = {};
  },
  visitor: {
    Program(nodePath: NodePath<t.Program>, { opts, file }: PluginPass) {
      nodePath.traverse({
        ImportDeclaration({ node }) {
          const { source } = node;
          const {
            opts: { filename },
          } = file;

          const importName = source?.value ? source.value : undefined;
          const replaceValue = getReplacePath(
            opts as BuiltInOptsType,
            importName,
            filename,
          );
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          const hashKey = filename + (importName || '');
          if (replaceValue) {
            if (typeof filename === 'string' && !replaceValueHash[hashKey]) {
              node.source.value = replaceValue;
              replaceValueHash[hashKey] = replaceValue;
            } else if (
              typeof filename === 'string' &&
              replaceValueHash[hashKey]
            ) {
              node.source.value = replaceValueHash[hashKey];
            } else {
              node.source.value = replaceValue;
            }
          }
        },
        // dynamic import
        CallExpression({ node }) {
          const { filename } = file.opts;
          const { callee, arguments: args } = node;
          if (
            callee.type === 'Import' ||
            (callee.type === 'Identifier' && callee.name === 'require')
          ) {
            const firstArg = args[0] as t.StringLiteral;
            if (firstArg.value) {
              const importName = firstArg.value;
              const replaceValue = getReplacePath(
                opts as BuiltInOptsType,
                importName,
                filename,
              );

              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              const hashKey = filename + (importName || '');
              if (replaceValue) {
                if (
                  typeof filename === 'string' &&
                  !replaceValueHash[hashKey]
                ) {
                  node.arguments = [t.stringLiteral(replaceValue)];
                  replaceValueHash[hashKey] = replaceValue;
                } else if (
                  typeof filename === 'string' &&
                  replaceValueHash[hashKey]
                ) {
                  node.arguments = [t.stringLiteral(replaceValueHash[hashKey])];
                } else {
                  node.arguments = [t.stringLiteral(replaceValue)];
                }
              }
            }
          }
        },
      });
    },
  },
});

export default importPath;
