import * as parser from '@babel/parser';
import * as types from '@babel/types';
import { Plugin as RollupPlugin } from 'rollup';
import {
  GLOBAL_CACHE_DIR_NAME,
  DEFAULT_LAZY_IMPORT_UI_COMPONENTS,
} from '../constants';
import { isJsRequest } from '../utils';

// FIXME: declare module 不生效的问题
const traverse = require('@babel/traverse');
const generate = require('@babel/generator');

function shouldProcess(code: string, id: string) {
  // transform js only
  if (!isJsRequest(id)) {
    return false;
  }
  // filter node_modules dir
  if (id.includes('node_modules') || id.includes(GLOBAL_CACHE_DIR_NAME)) {
    return false;
  }
  return DEFAULT_LAZY_IMPORT_UI_COMPONENTS.some((libName: string) =>
    // const reg = new RegExp(`('${libName}') | ("${libName}")`);
    code.includes(`${libName}`),
  );
}

const camelToKebab = (s: string) =>
  s
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();

function changeImport(code: string) {
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'typescript',
      'classProperties',
      'dynamicImport',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'decorators-legacy',
      'functionBind',
      'classPrivateMethods',
      ['pipelineOperator', { proposal: 'minimal' }],
      'optionalChaining',
      'optionalCatchBinding',
      'objectRestSpread',
      'numericSeparator',
    ],
  });

  // 遍历，转换
  traverse(ast, {
    ImportDeclaration(path: any) {
      const { node } = path;
      const source = node.source.value;
      const { specifiers } = node;

      if (!DEFAULT_LAZY_IMPORT_UI_COMPONENTS.includes(source)) {
        return;
      }

      if (Array.isArray(specifiers) && !specifiers.length) {
        return;
      }

      const isImportDefaultSpecifier = types.isImportDefaultSpecifier(
        specifiers[0],
      );

      const isImportNamespaceSpecifier = types.isImportNamespaceSpecifier(
        specifiers[0],
      );

      if (!isImportDefaultSpecifier && !isImportNamespaceSpecifier) {
        specifiers.forEach((specifier: any) => {
          const importedName = ['antd'].includes(source)
            ? camelToKebab(specifier.imported.name)
            : specifier.imported.name;
          const cssImporter = `import '${source}/es/${importedName}/style/index.js'`;
          const cssImporterAst = parser.parse(cssImporter, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript'],
          });
          path.insertBefore(cssImporterAst);
        });
      }
    },
  });

  return generate(ast).code;
}

export const lazyImportPlugin = (): RollupPlugin => ({
  name: 'esm-lazy-import',
  transform(code, id) {
    if (!shouldProcess(code, id)) {
      return;
    }
    return changeImport(code);
  },
});
