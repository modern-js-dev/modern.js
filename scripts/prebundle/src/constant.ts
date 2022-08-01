import { join } from 'path';
import glob from 'fast-glob';
import { copyFileSync } from 'fs-extra';
import { replaceFileContent } from './helper';
import type { TaskConfig } from './types';

export const ROOT_DIR = join(__dirname, '..', '..', '..');
export const PACKAGES_DIR = join(ROOT_DIR, 'packages');
export const DIST_DIR = 'compiled';

export const DEFAULT_EXTERNALS = {
  // External caniuse-lite data, so users can update it manually.
  'caniuse-lite': 'caniuse-lite',
  '/^caniuse-lite(/.*)/': 'caniuse-lite$1',
  // External webpack, it's hard to bundle.
  webpack: 'webpack',
  '/^webpack(/.*)/': 'webpack$1',
  // External lodash because lots of packages will depend on it.
  lodash: '@modern-js/utils/lodash',
  '/^lodash(/.*)/': 'lodash$1',
  esbuild: 'esbuild',
  // ncc bundled wrong package.json, using external to avoid this problem
  './package.json': './package.json',
  '../package.json': './package.json',
  postcss: 'postcss',
  '@babel/core': '@babel/core',
  '@babel/runtime': '@babel/runtime',
  '/^@babel/runtime(/.*)/': '@babel/runtime$1',
};

export const TASKS: TaskConfig[] = [
  {
    packageDir: 'toolkit/utils',
    packageName: '@modern-js/utils',
    dependencies: [
      // zero dependency
      'address',
      'filesize',
      'minimist',
      'commander',
      'import-lazy',
      'dotenv',
      'dotenv-expand',
      'url-join',
      'slash',
      'nanoid',
      {
        name: 'upath',
        afterBundle(task) {
          replaceFileContent(
            join(task.distPath, 'upath.d.ts'),
            content =>
              `${content.replace(
                'declare module "upath"',
                'declare namespace upath',
              )}\nexport = upath;`,
          );
        },
      },
      // a few dependencies
      'debug',
      'semver',
      'js-yaml',
      'mime-types',
      'strip-ansi',
      'gzip-size',
      'pkg-up',
      'recursive-readdir',
      {
        name: 'json5',
        externals: {
          minimist: '../minimist',
        },
      },
      // some dependencies
      'glob',
      'chalk',
      {
        name: 'signale',
        externals: {
          chalk: '../chalk',
        },
        packageJsonField: ['options'],
      },
      'execa',
      'fs-extra',
      'browserslist',
      'chokidar',
      'fast-glob',
      {
        name: 'globby',
        externals: {
          'fast-glob': '../fast-glob',
        },
      },
      {
        name: 'ora',
        externals: {
          chalk: '../chalk',
          'strip-ansi': '../strip-ansi',
        },
      },
      {
        name: 'inquirer',
        externals: {
          ora: '../ora',
          chalk: '../chalk',
          'strip-ansi': '../strip-ansi',
        },
      },
      {
        name: 'tsconfig-paths',
        externals: {
          json5: '../json5',
          minimist: '../minimist',
        },
        afterBundle(task) {
          const dtsFiles = glob.sync(join(task.depPath, 'lib', '*.d.ts'), {
            ignore: ['**/__tests__/**'],
          });
          dtsFiles.forEach(file => {
            copyFileSync(file, file.replace(task.depPath, task.distPath));
          });
        },
      },
      {
        name: 'webpack-chain',
        externals: {
          tapable: 'tapable',
        },
      },
    ],
  },
  {
    packageDir: 'cli/core',
    packageName: '@modern-js/core',
    dependencies: [
      // zero dependency
      {
        name: 'v8-compile-cache',
        ignoreDts: true,
      },
      // some dependencies
      {
        name: 'ajv',
        beforeBundle(task) {
          replaceFileContent(task.depEntry, content => {
            const addExports = `exports.codegen = require("./compile/codegen");`;
            if (content.includes(addExports)) {
              return content;
            }
            return `${content}\n${addExports}`;
          });
        },
        emitFiles: [
          {
            path: 'codegen.js',
            content: `module.exports = require('./').codegen;`,
          },
        ],
      },
      {
        name: 'ajv-keywords',
        ignoreDts: true,
        externals: {
          ajv: '../ajv',
          'ajv/dist/compile/codegen': '../ajv/codegen',
        },
      },
      {
        name: 'better-ajv-errors',
        ignoreDts: true,
        externals: {
          ajv: '../ajv',
        },
      },
    ],
  },
  {
    packageDir: 'cli/webpack',
    packageName: '@modern-js/webpack',
    dependencies: [
      'webpack-merge',
      {
        name: '@loadable/webpack-plugin',
        ignoreDts: true,
        externals: {
          semver: '@modern-js/utils/semver',
        },
      },
      {
        name: 'css-modules-typescript-loader',
        ignoreDts: true,
        externals: {
          'loader-utils': '../loader-utils1',
        },
      },
      {
        name: 'loader-utils1',
        ignoreDts: true,
        externals: {
          json5: '@modern-js/utils/json5',
        },
      },
      {
        name: 'loader-utils2',
        ignoreDts: true,
        externals: {
          json5: '@modern-js/utils/json5',
        },
      },
      {
        name: 'webpack-manifest-plugin',
        externals: {
          tapable: 'tapable',
          'webpack-sources': 'webpack-sources',
        },
        beforeBundle() {
          const pkgPath = require.resolve(
            'webpack-manifest-plugin/package.json',
          );
          replaceFileContent(pkgPath, content => {
            const json = JSON.parse(content);
            json.types = 'dist/index.d.ts';
            return JSON.stringify(json);
          });
        },
      },
      {
        name: 'webpackbar',
        ignoreDts: true,
      },
      {
        name: 'webpack-bundle-analyzer',
        externals: {
          chalk: '@modern-js/utils/chalk',
          'gzip-size': '@modern-js/utils/gzip-size',
        },
      },
      {
        name: 'copy-webpack-plugin',
        ignoreDts: true,
        externals: {
          globby: '@modern-js/utils/globby',
          'fast-glob': '@modern-js/utils/fast-glob',
          'schema-utils': 'schema-utils',
        },
      },
      {
        name: 'yaml-loader',
        ignoreDts: true,
        externals: {
          'loader-utils': '../loader-utils2',
        },
      },
      {
        name: 'toml-loader',
        ignoreDts: true,
      },
      {
        name: 'markdown-loader',
        ignoreDts: true,
      },
      {
        name: 'file-loader',
        ignoreDts: true,
        externals: {
          'schema-utils': 'schema-utils',
          'loader-utils': '../loader-utils2',
        },
      },
      {
        name: 'url-loader',
        ignoreDts: true,
        externals: {
          'schema-utils': 'schema-utils',
          'loader-utils': '../loader-utils2',
          'mime-types': '@modern-js/utils/mime-types',
        },
        afterBundle(task) {
          replaceFileContent(join(task.distPath, 'index.js'), content => {
            // using prebunled file-loader
            return content.replace(
              '"file-loader"',
              'require.resolve("../file-loader")',
            );
          });
        },
      },
      {
        name: 'babel-loader',
        ignoreDts: true,
        externals: {
          '@babel/core': '@babel/core',
          'loader-utils': '../loader-utils1',
        },
      },
      {
        name: 'postcss-loader',
        ignoreDts: true,
        externals: {
          semver: '@modern-js/utils/semver',
        },
      },
      {
        name: 'css-loader',
        ignoreDts: true,
        externals: {
          semver: '@modern-js/utils/semver',
        },
      },
      {
        name: 'webpack-dev-middleware',
        externals: {
          'schema-utils': 'schema-utils',
          'schema-utils/declarations/validate':
            'schema-utils/declarations/validate',
          'mime-types': '@modern-js/utils/mime-types',
        },
      },
    ],
  },
  {
    packageDir: 'cli/plugin-postcss',
    packageName: '@modern-js/plugin-postcss',
    dependencies: [
      {
        name: 'postcss-value-parser',
        ignoreDts: true,
      },
      {
        name: 'postcss-custom-properties',
        ignoreDts: true,
        externals: {
          'postcss-value-parser': '../postcss-value-parser',
        },
      },
      {
        name: 'postcss-flexbugs-fixes',
        ignoreDts: true,
      },
      {
        name: 'postcss-font-variant',
        ignoreDts: true,
      },
      {
        name: 'postcss-initial',
        ignoreDts: true,
      },
      {
        name: 'postcss-media-minmax',
        ignoreDts: true,
      },
      {
        name: 'postcss-nesting',
        ignoreDts: true,
      },
      {
        name: 'postcss-page-break',
        ignoreDts: true,
      },
      {
        name: 'autoprefixer',
        ignoreDts: true,
        externals: {
          browserslist: '@modern-js/utils/browserslist',
          'postcss-value-parser': '../postcss-value-parser',
        },
      },
    ],
  },
  {
    packageDir: 'cli/babel-preset-base',
    packageName: '@modern-js/babel-preset-base',
    dependencies: [
      {
        name: '@babel/parser',
        ignoreDts: true,
      },
      {
        name: '@babel/helper-plugin-utils',
        ignoreDts: true,
      },
      {
        name: '@babel/helper-validator-identifier',
        ignoreDts: true,
      },
      {
        name: '@babel/types',
        externals: {
          '@babel/helper-validator-identifier':
            '../helper-validator-identifier',
        },
      },
      {
        name: '@babel/generator',
        ignoreDts: true,
        externals: {
          '@babel/types': '../types',
        },
      },
      {
        name: '@babel/highlight',
        ignoreDts: true,
        externals: {
          chalk: '@modern-js/utils/chalk',
        },
      },
      {
        name: '@babel/code-frame',
        ignoreDts: true,
        externals: {
          '@babel/highlight': '../highlight',
        },
      },
      {
        name: '@babel/template',
        ignoreDts: true,
        externals: {
          '@babel/types': '../types',
          '@babel/parser': '../parser',
          '@babel/code-frame': '../code-frame',
        },
      },
      {
        name: '@babel/traverse',
        ignoreDts: true,
        externals: {
          '@babel/types': '../types',
          '@babel/parser': '../parser',
          '@babel/generator': '../generator',
          '@babel/template': '../template',
          '@babel/code-frame': '../code-frame',
        },
      },
      {
        name: '@babel/helper-annotate-as-pure',
        ignoreDts: true,
        externals: {
          '@babel/types': '../types',
        },
      },
      {
        name: '@babel/helper-module-imports',
        ignoreDts: true,
        externals: {
          '@babel/types': '../types',
        },
      },
      {
        name: 'babel-plugin-transform-react-remove-prop-types',
        ignoreDts: true,
      },
      {
        name: 'babel-plugin-dynamic-import-node',
        ignoreDts: true,
      },
      {
        name: 'babel-plugin-import',
        ignoreDts: true,
        externals: {
          '@babel/helper-module-imports': '../@babel/helper-module-imports',
        },
      },
      {
        name: 'babel-plugin-lodash',
        ignoreDts: true,
        externals: {
          glob: '@modern-js/utils/glob',
          '@babel/types': '../@babel/types',
          '@babel/helper-module-imports': '../@babel/helper-module-imports',
        },
      },
      {
        name: 'babel-plugin-styled-components',
        ignoreDts: true,
        externals: {
          '@babel/helper-module-imports': '../@babel/helper-module-imports',
          '@babel/helper-annotate-as-pure': '../@babel/helper-annotate-as-pure',
        },
      },
      {
        name: 'babel-plugin-macros',
        ignoreDts: true,
        externals: {
          resolve: 'resolve',
          cosmiconfig: 'cosmiconfig',
        },
      },
      {
        name: '@babel/plugin-proposal-pipeline-operator',
        ignoreDts: true,
        externals: {
          '@babel/helper-plugin-utils': '../helper-plugin-utils',
        },
      },
      {
        name: '@babel/plugin-proposal-export-default-from',
        ignoreDts: true,
        externals: {
          '@babel/helper-plugin-utils': '../helper-plugin-utils',
        },
      },
      {
        name: '@babel/plugin-proposal-partial-application',
        ignoreDts: true,
        externals: {
          '@babel/helper-plugin-utils': '../helper-plugin-utils',
        },
      },
      {
        name: '@babel/plugin-proposal-function-bind',
        ignoreDts: true,
        externals: {
          '@babel/helper-plugin-utils': '../helper-plugin-utils',
        },
      },
      {
        name: '@babel/helper-create-class-features-plugin',
        ignoreDts: true,
        externals: {
          '@babel/types': '../types',
          '@babel/traverse': '../traverse',
          '@babel/template': '../template',
        },
      },
      {
        name: '@babel/plugin-proposal-decorators',
        ignoreDts: true,
        externals: {
          '@babel/types': '../types',
          '@babel/traverse': '../traverse',
          '@babel/helper-plugin-utils': '../helper-plugin-utils',
          '@babel/helper-create-class-features-plugin':
            '../helper-create-class-features-plugin',
        },
      },
    ],
  },
];
