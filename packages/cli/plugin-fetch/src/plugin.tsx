import { useContext } from 'react';
import { RuntimeReactContext } from '@modern-js/runtime';
import type { Plugin } from '@modern-js/runtime';
import { initFetch, ModernFetch } from './fetch';

declare module '@modern-js/runtime' {
  interface RuntimeContext {
    // TODO: FIXME
    SSRContext: any;
    fetch: ModernFetch;
  }
}

export const fetchPlugin = (): Plugin => ({
  name: '@modern-js/plugin-fetch',

  setup: () => ({
    init: ({ context }, next) => {
      const fetch = initFetch(context?.SSRContext || {});
      context.fetch = fetch;
      return next({ context });
    },
  }),
});

export const useFetch = () => {
  const runtimeContext = useContext(RuntimeReactContext);
  return runtimeContext.fetch;
};
