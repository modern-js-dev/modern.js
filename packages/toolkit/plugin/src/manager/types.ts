import type {
  Pipeline,
  Container,
  MaybeAsync,
  Middleware,
  AsyncPipeline,
} from 'farrow-pipeline';
import type {
  Brook,
  Waterfall,
  AsyncBrook,
  AsyncWaterfall,
} from '../waterfall';
import type {
  Worker,
  Workflow,
  AsyncWorker,
  AsyncWorkflow,
  ParallelWorkflow,
} from '../workflow';

/** all hook types */
export type Hook =
  | Waterfall<any>
  | AsyncWaterfall<any>
  | Workflow<any, any>
  | AsyncWorkflow<any, any>
  | ParallelWorkflow<any>
  | Pipeline<any, any>
  | AsyncPipeline<any, any>;

export type HooksMap = Record<string, Hook>;

/** extract the type of callback function from a hook */
export type ToThread<P extends Hook> = P extends Workflow<infer I, infer O>
  ? Worker<I, O>
  : P extends AsyncWorkflow<infer I, infer O>
  ? AsyncWorker<I, O>
  : P extends ParallelWorkflow<infer I, infer O>
  ? AsyncWorker<I, O>
  : P extends Waterfall<infer I>
  ? Brook<I>
  : P extends AsyncWaterfall<infer I>
  ? AsyncBrook<I>
  : P extends Pipeline<infer I, infer O>
  ? Middleware<I, O>
  : P extends AsyncPipeline<infer I, infer O>
  ? Middleware<I, MaybeAsync<O>>
  : never;

/** extract types of callback function from hooks */
export type ToThreads<PS> = {
  [K in keyof PS]: PS[K] extends Hook
    ? ToThread<PS[K]>
    : PS[K] extends void
    ? void
    : never;
};

/** extract run method from a hook */
export type RunnerFromHook<P extends Hook> = P extends Waterfall<infer I>
  ? Waterfall<I>['run']
  : P extends AsyncWaterfall<infer I>
  ? AsyncWaterfall<I>['run']
  : P extends Workflow<infer I, infer O>
  ? Workflow<I, O>['run']
  : P extends AsyncWorkflow<infer I, infer O>
  ? AsyncWorkflow<I, O>['run']
  : P extends ParallelWorkflow<infer I, infer O>
  ? ParallelWorkflow<I, O>['run']
  : P extends Pipeline<infer I, infer O>
  ? Pipeline<I, O>['run']
  : P extends AsyncPipeline<infer I, infer O>
  ? AsyncPipeline<I, O>['run']
  : never;

/** extract all run methods from hooks */
export type ToRunners<PS> = {
  [K in keyof PS]: PS[K] extends Hook
    ? RunnerFromHook<PS[K]>
    : PS[K] extends void
    ? void
    : never;
};

/** all options to define a plugin */
export type PluginOptions<Hooks, Setup = undefined> = {
  name?: string;
  pre?: string[];
  post?: string[];
  setup?: Setup;
  rivals?: string[];
  required?: string[];
  usePlugins?: PluginOptions<Hooks, Setup>[];
  registerHook?: Partial<Hooks>;
};

/** options of manager.init method */
export type InitOptions = {
  container?: Container;
};

/** common api of setup function */
export type CommonAPI<Hooks> = {
  useHookRunners: () => ToRunners<Hooks>;
};
