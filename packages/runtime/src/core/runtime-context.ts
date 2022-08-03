import { createContext } from 'react';
import { createLoaderManager } from './loader/loaderManager';
import { runtime } from './plugin';

export interface RuntimeContext {
  loaderManager: ReturnType<typeof createLoaderManager>;
  runner: ReturnType<typeof runtime.init>;
  [key: string]: any;
}

export const RuntimeReactContext = createContext<RuntimeContext>({} as any);

export interface TRuntimeContext {
  initialData?: Record<string, unknown>;
  [key: string]: any;
}
