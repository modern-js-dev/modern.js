import pkgJSON from './package.json';

/** @type {import('@modern-js/module-tools').UserConfig} */
module.exports = {
  output: {
    buildConfig: [
      {
        enableDts: true,
        dtsOnly: true,
        outputPath: './types',
      },
      {
        buildType: 'bundle',
        format: 'cjs',
        bundleOptions: {
          skipDeps: false,
          externals: [...Object.keys(pkgJSON.dependencies), 'spawn-sync'],
        },
      },
    ],
  },
};
