import { useContext } from 'react';
import { RuntimeReactContext } from '@modern-js/runtime-core';
import { createStore, Store } from '@modern-js-reduck/store';
import { Provider } from '@modern-js-reduck/react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import type { Plugin } from '@modern-js/runtime-core';
import { isBrowser } from '../../common';

declare module '@modern-js/runtime-core' {
  interface RuntimeContext {
    store: Store;
  }

  interface TRuntimeContext {
    store: Store;
  }

  interface SSRData {
    storeState: any;
  }
}

export type StateConfig = Parameters<typeof createStore>[0];

const state = (config: StateConfig): Plugin => ({
  name: '@modern-js/plugin-state',
  setup: () => {
    return {
      hoc({ App }, next) {
        const getStateApp = (props: any) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const context = useContext(RuntimeReactContext);

          return (
            <Provider store={context.store} config={config}>
              <App {...props} />
            </Provider>
          );
        };
        return next({
          App: hoistNonReactStatics(getStateApp, App),
        });
      },
      init({ context }, next) {
        const storeConfig = config || {};

        if (isBrowser()) {
          storeConfig.initialState =
            storeConfig.initialState ||
            window?._SSR_DATA?.data?.storeState ||
            {};
        }

        context.store = createStore(storeConfig);

        next({ context });
      },
      pickContext({ context, pickedContext }, next) {
        return next({
          context,
          pickedContext: {
            ...pickedContext,
            store: context.store,
          },
        });
      },
    };
  },
});

export default state;

export * from '../plugins';
