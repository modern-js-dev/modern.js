export const EN_LOCALE = {
  command: {
    dev: {
      describe: 'start dev server',
      config: 'specify config file',
      entry: 'compiler by entry',
      apiOnly: 'start api server only',
      analyze: 'analyze bundle size',
    },
    build: { describe: 'build application', analyze: 'analyze bundle size' },
    start: { describe: 'start server' },
    deploy: { describe: 'deploy application' },
    new: {
      describe: 'generator runner for MWA project',
      debug: 'using debug mode to log something',
      config: 'set default generator config(json string)',
      distTag: `use specified tag version for it's generator`,
      registry: 'set npm registry url to run npm command',
    },
  },
};
