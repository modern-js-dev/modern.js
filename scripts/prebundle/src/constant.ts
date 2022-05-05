import { join } from 'path';
import { replaceFileContent } from './helper';
import type { TaskConfig } from './types';

export const ROOT_DIR = join(__dirname, '..', '..', '..');
export const PACKAGES_DIR = join(ROOT_DIR, 'packages');
export const DIST_DIR = 'compiled';

export const DEFAULT_EXTERNALS = {
  // External caniuse-lite data, so users can update it manually.
  'caniuse-lite': 'caniuse-lite',
  '/caniuse-lite(/.*)/': 'caniuse-lite$1',
  // External webpack, it's hard to bundle.
  webpack: 'webpack',
  '/webpack(/.*)/': 'webpack$1',
  // External lodash because lots of packages will depend on it.
  lodash: '@modern-js/utils/lodash',
  esbuild: 'esbuild',
  // ncc bundled wrong package.json, using external to avoid this problem
  './package.json': './package.json',
  '../package.json': './package.json',
};

export const TASKS: TaskConfig[] = [
  {
    packageDir: 'toolkit/utils',
    packageName: '@modern-js/utils',
    dependencies: [
      // zero dependency
      'address',
      'upath',
      'filesize',
      'minimist',
      'commander',
      'import-lazy',
      'dotenv',
      'dotenv-expand',
      'url-join',
      'slash',
      // a few dependencies
      'debug',
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
      {
        name: 'loader-utils2',
        ignoreDts: true,
        externals: {
          json5: '@modern-js/utils/json5',
        },
      },
      {
        name: 'loader-utils3',
        ignoreDts: true,
      },
      {
        name: 'webpack-chain',
        externals: {
          tapable: 'tapable',
        },
      },
      'webpack-merge',
      {
        name: 'webpack-manifest-plugin',
        externals: {
          tapable: 'tapable',
          'webpack-sources': 'webpack-sources',
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
    ],
  },
];
