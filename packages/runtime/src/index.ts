import '@modern-js/core';
import type { StateConfig } from './state';
import type { RouterConfig } from './router';

export type { Plugin, RuntimeContext, TRuntimeContext } from './core';
export {
  createApp,
  createPlugin,
  useLoader,
  bootstrap,
  RuntimeReactContext,
  registerPrefetch,
  defineConfig,
  registerInit,
  useRuntimeContext,
} from './core';

declare module './core' {
  interface AppConfig {
    router?: RouterConfig | boolean;
    state?: StateConfig | boolean;
  }
}

declare module '@modern-js/core' {
  interface RuntimeConfig {
    router?: RouterConfig | boolean;
    state?: StateConfig | boolean;
  }
}
