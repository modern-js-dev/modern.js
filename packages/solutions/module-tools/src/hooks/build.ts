import { createParallelWorkflow, createAsyncPipeline } from '@modern-js/plugin';
import {
  registerHook,
  NormalizedConfig,
  LessOption,
  SassOption,
  PostcssOption,
} from '@modern-js/core';
import { CompilerItem, PostcssCompilerItem } from '../style-compiler';

export interface PlatformBuildOption {
  isTsProject: boolean;
}

export const platformBuild = createParallelWorkflow<
  PlatformBuildOption,
  {
    name: string;
    title: string;
    taskPath: string;
    params: string[];
  }
>();

export const moduleLessConfig = createAsyncPipeline<
  { modernConfig: NormalizedConfig },
  LessOption | undefined
>();

export const moduleSassConfig = createAsyncPipeline<
  { modernConfig: NormalizedConfig },
  SassOption | undefined
>();

export const modulePostcssConfig = createAsyncPipeline<
  { modernConfig: NormalizedConfig; appDirectory: string },
  PostcssOption | undefined
>();

export const moduleTailwindConfig = createAsyncPipeline<
  { modernConfig: NormalizedConfig },
  any
>();

export const moduleLessCompiler = createAsyncPipeline<
  unknown,
  CompilerItem | undefined
>();

export const moduleSassCompiler = createAsyncPipeline<
  unknown,
  CompilerItem | undefined
>();

export const modulePostcssCompiler = createAsyncPipeline<
  unknown,
  PostcssCompilerItem | undefined
>();

export const buildHooks = {
  platformBuild,
  moduleLessConfig,
  moduleLessCompiler,
  moduleSassConfig,
  moduleSassCompiler,
  modulePostcssConfig,
  modulePostcssCompiler,
  moduleTailwindConfig,
};

export const lifecycle = () => {
  registerHook({
    moduleLessConfig,
    moduleLessCompiler,
    moduleSassConfig,
    moduleSassCompiler,
    modulePostcssConfig,
    modulePostcssCompiler,
    moduleTailwindConfig,
    platformBuild,
  });
};

declare module '@modern-js/core' {
  export interface Hooks {
    platformBuild: typeof platformBuild;
    moduleLessConfig: typeof moduleLessConfig;
    moduleLessCompiler: typeof moduleLessCompiler;
    moduleSassConfig: typeof moduleSassConfig;
    moduleSassCompiler: typeof moduleSassCompiler;
    modulePostcssConfig: typeof modulePostcssConfig;
    modulePostcssCompiler: typeof modulePostcssCompiler;
    moduleTailwindConfig: typeof moduleTailwindConfig;
  }
}
