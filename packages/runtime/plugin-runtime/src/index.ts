import type { StateConfig } from './state';
import type { RouterConfig } from './router';

export type { RuntimeContext, TRuntimeContext } from '@modern-js/runtime-core';
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
} from '@modern-js/runtime-core';

declare module '@modern-js/runtime-core' {
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
