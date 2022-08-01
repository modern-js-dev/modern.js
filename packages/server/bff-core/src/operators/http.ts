import type { z } from 'zod';
import {
  HttpMetadata,
  Operator,
  OperatorType,
  HttpMethod,
  TriggerType,
  ResponseMetaType,
  MetadataHelper,
} from '../types';
import { ValidationError } from '../errors/http';

export interface ResponseMeta {
  type: ResponseMetaType;
  value: unknown;
}

type UnknownKeysParam = 'passthrough' | 'strict' | 'strip';

const validateInput = async <
  T extends z.ZodRawShape,
  UnknownKeys extends UnknownKeysParam = 'strip',
  Catchall extends z.ZodTypeAny = z.ZodTypeAny,
  Output = z.objectOutputType<T, Catchall>,
  Input = z.objectInputType<T, Catchall>,
  Def extends z.ZodTypeDef = z.ZodTypeDef,
>(
  schema:
    | z.ZodObject<T, UnknownKeys, Catchall, Output, Input>
    | z.ZodType<Output, Def, Input>,
  input: Input,
): Promise<Output> => {
  try {
    return await schema.parseAsync(input);
  } catch (error) {
    const { z: zod } = require('zod');
    if (error instanceof (zod as typeof z).ZodError) {
      throw new ValidationError(400, error.message);
    }
    throw error;
  }
};

export const createHttpOperator = (method: HttpMethod) => {
  return (urlPath: string): Operator<void> => {
    return {
      name: method,
      metadata({ setMetadata }) {
        setMetadata(OperatorType.Trigger, {
          type: TriggerType.Http,
          path: urlPath,
          method,
        });
      },
    };
  };
};

export const Get = createHttpOperator(HttpMethod.Get);
export const Post = createHttpOperator(HttpMethod.Post);
export const Put = createHttpOperator(HttpMethod.Put);
export const Delete = createHttpOperator(HttpMethod.Delete);
export const Connect = createHttpOperator(HttpMethod.Connect);
export const Trace = createHttpOperator(HttpMethod.Trace);
export const Patch = createHttpOperator(HttpMethod.Patch);
export const Option = createHttpOperator(HttpMethod.Option);
export const Head = createHttpOperator(HttpMethod.Head);

export const Data = <
  T extends z.ZodRawShape,
  UnknownKeys extends UnknownKeysParam = 'strip',
  Catchall extends z.ZodTypeAny = z.ZodTypeAny,
  Output = z.objectOutputType<T, Catchall>,
  Input = z.objectInputType<T, Catchall>,
>(
  schema: z.ZodObject<T, UnknownKeys, Catchall, Output, Input> | z.ZodType,
): Operator<
  {
    data: Input;
  },
  {
    data: Output;
  }
> => {
  return {
    name: HttpMetadata.Data,
    metadata({ setMetadata }) {
      setMetadata(HttpMetadata.Data, schema);
    },
    async validate(helper, next) {
      const { inputs } = helper;
      const { data } = inputs;
      helper.outputs.data = await validateInput(schema, data);
      return next();
    },
  };
};

export const Query = <
  T extends z.ZodRawShape,
  UnknownKeys extends UnknownKeysParam = 'strip',
  Catchall extends z.ZodTypeAny = z.ZodTypeAny,
  Output = z.objectOutputType<T, Catchall>,
  Input = z.objectInputType<T, Catchall>,
>(
  schema: z.ZodObject<T, UnknownKeys, Catchall, Output, Input> | z.ZodType,
): Operator<
  {
    query: Input;
  },
  {
    query: Output;
  }
> => {
  return {
    name: HttpMetadata.Query,
    metadata({ setMetadata }) {
      setMetadata(HttpMetadata.Query, schema);
    },
    async validate(helper, next) {
      const { inputs } = helper;
      const { query } = inputs;
      helper.outputs.query = await validateInput(schema, query);
      return next();
    },
  };
};

export const Params = <
  T extends z.ZodRawShape,
  UnknownKeys extends UnknownKeysParam = 'strip',
  Catchall extends z.ZodTypeAny = z.ZodTypeAny,
  Output = z.objectOutputType<T, Catchall>,
  Input = z.objectInputType<T, Catchall>,
>(
  schema: z.ZodObject<T, UnknownKeys, Catchall, Output, Input> | z.ZodType,
): Operator<
  {
    params: Input;
  },
  {
    params: Output;
  }
> => {
  return {
    name: HttpMetadata.Params,
    metadata({ setMetadata }) {
      setMetadata(HttpMetadata.Params, schema);
    },
    async validate(helper, next) {
      const { inputs } = helper;
      const { params } = inputs;
      helper.outputs.params = await validateInput(schema, params);
      return next();
    },
  };
};

export const Headers = <
  T extends z.ZodRawShape,
  UnknownKeys extends UnknownKeysParam = 'strip',
  Catchall extends z.ZodTypeAny = z.ZodTypeAny,
  Output = z.objectOutputType<T, Catchall>,
  Input = z.objectInputType<T, Catchall>,
>(
  schema: z.ZodObject<T, UnknownKeys, Catchall, Output, Input>,
): Operator<
  {
    headers: Input;
  },
  {
    headers: Output;
  }
> => {
  return {
    name: HttpMetadata.Headers,
    metadata({ setMetadata }) {
      setMetadata(HttpMetadata.Headers, schema);
    },
    async validate(helper, next) {
      const { inputs } = helper;
      const { headers } = inputs;
      helper.outputs.headers = await validateInput(schema, headers);
      return next();
    },
  };
};

const setResponseMeta = (
  helper: MetadataHelper,
  type: ResponseMetaType,
  value: ResponseMeta['value'],
) => {
  const responseMetaData =
    helper.getMetadata<ResponseMeta[]>(HttpMetadata.Response) || [];

  helper.setMetadata(HttpMetadata.Response, [
    ...responseMetaData,
    {
      type,
      value,
    },
  ]);
};

export const HttpCode = (statusCode: number): Operator<void> => {
  return {
    name: 'HttpCode',
    metadata(helper) {
      setResponseMeta(helper, ResponseMetaType.StatusCode, statusCode);
    },
  };
};

export const SetHeaders = (headers: Record<string, string>): Operator<void> => {
  return {
    name: 'SetHeaders',
    metadata(helper) {
      setResponseMeta(helper, ResponseMetaType.Headers, headers);
    },
  };
};

export const Redirect = (url: string): Operator<void> => {
  return {
    name: 'Redirect',
    metadata(helper) {
      setResponseMeta(helper, ResponseMetaType.Redirect, url);
    },
  };
};
