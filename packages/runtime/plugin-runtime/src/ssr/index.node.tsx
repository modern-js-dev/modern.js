/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import path from 'path';
import { registerPrefetch } from '@modern-js/runtime-core';
import type { Plugin } from '@modern-js/runtime-core';

import { isBrowser } from '../common';
import { SSRServerContext } from './serverRender/type';
import prefetch from './prefetch';
import { formatServer } from './utils';

const registeredApps = new WeakSet();

const plugin = (): Plugin => ({
  name: '@modern-js/plugin-ssr',
  setup: () => {
    return {
      server: async ({ App, context }) => {
        if (!registeredApps.has(App)) {
          registerPrefetch(App, _context => prefetch(App, _context));
          registeredApps.add(App);
        }

        if (!isBrowser()) {
          const html = await require('./serverRender').render(
            context,
            context?.ssrContext.distDir || path.join(process.cwd(), 'dist'),
            App,
          );

          return html;
        }

        return null;
      },
      init({ context }, next) {
        const { request }: { request: SSRServerContext['request'] } =
          context.ssrContext;

        context.ssrContext.request = formatServer(request);
        return next({ context });
      },
      pickContext: ({ context, pickedContext }, next) => {
        const { request, response } = context?.ssrContext;
        const { initialData } = context;

        return next({
          context,
          pickedContext: {
            ...pickedContext,
            initialData,
            request,
            response,
          },
        });
      },
    };
  },
});

export default plugin;
export * from './react';
/* eslint-enable @typescript-eslint/no-require-imports */
/* eslint-enable @typescript-eslint/no-var-requires */
