import pkg from './package.json';

const entries = Object.keys(pkg.exports);

const entryConfig = {};
entries.forEach(entry => {
  if (entry !== '.' && entry !== './cli') {
    const matchs = entry.match(/.\/(.*)/);
    entryConfig[matchs[1]] = pkg.exports[entry]['jsnext:source'];
  }
});

/** @type {import('@modern-js/module-tools').UserConfig} */
module.exports = {
  output: {
    buildConfig: [
      {
        buildType: 'bundleless',
        enableDts: true,
        dtsOnly: true,
        outputPath: './types',
      },
      {
        buildType: 'bundle',
        format: 'cjs',
        outputPath: './exports',
        bundleOptions: {
          entry: entryConfig,
          skipDeps: false,
          externals: ['@modern-js/core', 'react-dom', 'react-router-dom'],
        },
      },
      {
        buildType: 'bundle',
        format: 'cjs',
        bundleOptions: {
          entry: {
            index: './src/index.ts',
            cli: './src/cli/index.ts',
            router: './src/router/index.ts',
            ssr: './src/ssr/index.tsx',
            state: './src/state/index.ts',
          },
          skipDeps: false,
          externals: ['@modern-js/core'],
        },
      },
    ],
  },
};
