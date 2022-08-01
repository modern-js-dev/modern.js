import { Merge } from 'type-fest';

export enum OperatorType {
  Trigger,
  Middleware,
}

export enum TriggerType {
  Http,
}

export enum HttpMetadata {
  Method = 'METHOD',
  Data = 'DATA',
  Query = 'QUERY',
  Params = 'PARAMS',
  Headers = 'HEADERS',
  Response = 'RESPONSE',
}

export enum ResponseMetaType {
  StatusCode,
  Redirect,
  Headers,
}

export enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
  Connect = 'CONNECT',
  Trace = 'TRACE',
  Patch = 'PATCH',
  Option = 'OPTION',
  Head = 'HEAD',
}

export type InputSchemaMeata = Extract<
  HttpMetadata,
  | HttpMetadata.Data
  | HttpMetadata.Query
  | HttpMetadata.Headers
  | HttpMetadata.Params
>;

export type ValidateFunc<Outputs> = (
  helper: ExecuteHelper<Outputs>,
  next: () => Promise<any>,
) => Promise<any>;

export type ExecuteHelper<Outputs> = {
  result?: any;
  outputs: Outputs;
  readonly inputs: any;
};

export type MetadataHelper = {
  setMetadata: <T = any>(key: any, value: T) => void;
  getMetadata: <T = any>(key: any) => T;
};

export type Operator<Input, Output = Input> = {
  name: string;
  inputType?: Input;
  outputType?: Output;
  metadata?: (helper: MetadataHelper) => void;
  validate?: ValidateFunc<Output>;
};

export type MaybeAsync<T> = Promise<T> | T;

export type ApiRunner<
  Input extends object | void | unknown,
  Output extends MaybeAsync<any>,
> = (...args: Input extends void ? never : [input: Input]) => Output;

export type NonNullable<T> = Exclude<T, null | undefined>;

export type ExtractInputType<T> = {
  [key in keyof T]: T[key] extends Operator<any, any>
    ? NonNullable<T[key]['inputType']>
    : void;
};

export type ExtractOuputType<T> = {
  [key in keyof T]: T[key] extends Operator<any, any>
    ? NonNullable<T[key]['outputType']>
    : void;
};

// fork from https://github.com/midwayjs/hooks/blob/main/packages/hooks-core/src/api/type.ts
// eslint-disable-next-line @typescript-eslint/ban-types
export type ArrayToObject<T, R = {}> = T extends [infer First, ...infer Rest]
  ? First extends PromiseLike<infer PromiseValue>
    ? PromiseValue
    : First extends object
    ? Merge<First, ArrayToObject<Rest, R>>
    : ArrayToObject<Rest, R>
  : R;

export type AsyncFunction = (...args: any[]) => Promise<any>;

export const httpMethods = Object.values(HttpMethod);
