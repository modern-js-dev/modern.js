import type React from 'react';
import {
  Setup,
  ToThreads,
  CommonAPI,
  PluginOptions,
  createManager,
  createPipeline,
  createAsyncPipeline,
} from '@modern-js/plugin';
import type { RuntimeContext, TRuntimeContext } from './runtime-context';
import { createLoaderManager } from './loader/loaderManager';

const hoc = createPipeline<
  {
    App: React.ComponentType<any>;
  },
  React.ComponentType<any>
>();

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppProps {}

const provide = createPipeline<
  {
    element: JSX.Element;
    readonly props: AppProps;
    readonly context: RuntimeContext;
  },
  JSX.Element
>();

const client = createAsyncPipeline<
  {
    App: React.ComponentType<any>;
    readonly context?: RuntimeContext;
    rootElement: HTMLElement;
  },
  void
>();

const server = createAsyncPipeline<
  {
    App: React.ComponentType<any>;
    readonly context?: RuntimeContext;
  },
  string
>();

const init = createAsyncPipeline<
  {
    context: RuntimeContext;
  },
  unknown
>();

const pickContext = createPipeline<
  { context: RuntimeContext; pickedContext: TRuntimeContext },
  TRuntimeContext
>();

const runtimeHooks = {
  hoc,
  provide,
  client,
  server,
  init,
  pickContext,
};

/** All hooks of runtime plugin. */
export type RuntimeHooks = typeof runtimeHooks;

/** All hook callbacks of runtime plugin. */
export type RuntimeHookCallbacks = ToThreads<RuntimeHooks>;

/** All apis for runtime plugin. */
export type PluginAPI = CommonAPI<RuntimeHooks>;

/** Plugin options of a runtime plugin. */
export type Plugin = PluginOptions<RuntimeHooks, Setup<RuntimeHooks>>;

export const createRuntime = () => createManager(runtimeHooks);

/**
 * register init hook. It would be revoked both ssr and csr.
 */
const registerInit = (
  App: React.ComponentType,
  _init: (context: RuntimeContext) => any | Promise<any>,
) => {
  const originalInit = (App as any).init;
  (App as any).init = async (context: RuntimeContext) => {
    if (!context.loaderManager) {
      context.loaderManager = createLoaderManager({});
    }

    await Promise.all([originalInit?.(context), _init?.(context)]);
  };
};

/**
 * register prefetch hook. It would be revoked both ssr and csr.
 * But if ssr success, It wont exec in csr again.
 * If ssr prefetch failed, It will fallback to exec in csr.
 */
const registerPrefetch = (
  App: React.ComponentType,
  prefetch: (context: RuntimeContext) => Promise<any>,
) => {
  const originalPrefetch = (App as any).prefetch;
  (App as any).prefetch = async (context: RuntimeContext) => {
    const originResult = await originalPrefetch?.(context);
    const result = await prefetch?.(context);

    return {
      ...originResult,
      ...result,
    };
  };
};

export const runtime = createRuntime();

export const { createPlugin } = runtime;

export { registerInit, registerPrefetch };
