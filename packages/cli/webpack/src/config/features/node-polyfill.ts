import { ProvidePlugin } from 'webpack';
import { CHAIN_ID, WebpackChain } from '@modern-js/utils';

export function getNodePolyfill() {
  const nodeLibsBrowser = require('node-libs-browser');
  return Object.keys(nodeLibsBrowser).reduce<Record<string, string | false>>(
    (previous, name) => {
      if (nodeLibsBrowser[name]) {
        previous[name] = nodeLibsBrowser[name];
      } else {
        previous[name] = false;
      }
      return previous;
    },
    {},
  );
}

export function applyNodePolyfillResolve(chain: WebpackChain) {
  chain.resolve.merge({
    fallback: getNodePolyfill(),
  });
}

export function applyNodePolyfillProvidePlugin(chain: WebpackChain) {
  const nodeLibsBrowser = require('node-libs-browser');
  chain.plugin(CHAIN_ID.PLUGIN.NODE_POLYFILL_PROVIDE).use(ProvidePlugin, [
    {
      Buffer: [nodeLibsBrowser.buffer, 'Buffer'],
      process: [nodeLibsBrowser.process],
    },
  ]);
}
