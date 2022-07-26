/** @type {import('@modern-js/module-tools').UserConfig} */
module.exports = {
  output: {
    buildConfig: [
      {
        buildType: 'bundle',
        format: 'cjs',
        // enableDts: true,
        bundleOptions: {
          skipDeps: false,
          externals: ['@modern-js/core'],
        },
      },
      {
        buildType: 'bundle',
        format: 'esm',
        // enableDts: true,
        bundleOptions: {
          skipDeps: false,
          externals: ['@modern-js/core'],
        },
      },
    ],
  },
};
