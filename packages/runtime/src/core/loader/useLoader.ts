import {
  useContext,
  useRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from 'react';
import invariant from 'invariant';
import { RuntimeReactContext } from '../runtime-context';
import { Loader, LoaderStatus, LoaderResult } from './loaderManager';

export interface SSRData {
  loadersData: Record<string, LoaderResult | undefined>;
  initialData?: Record<string, unknown>;
}
export interface SSRContainer {
  data?: SSRData;
}

declare global {
  interface Window {
    _SSR_DATA?: SSRContainer;
  }
}
export interface LoaderOptions<
  Params = any,
  TData = any,
  TError extends Error = any,
> {
  /**
   * Revoke when loader excuted successfully.
   */
  onSuccess?: (data: TData) => void;

  /**
   * Revoke when loader ended with error
   */
  onError?: (error: TError) => void;

  /**
   * initialData to display once loader is ready.
   */
  initialData?: TData;

  /**
   * whether skip loader
   * if true, the loader will not exec.
   */
  skip?: boolean;

  /**
   * User params, it will pass to loader's second parameter.
   */
  params?: Params;

  /**
   * whether loader can exec on build phase.
   */
  static?: boolean;
}

// todo: SSRContext
type LoaderFn<P = any, T = any> = (context: any, params: P) => Promise<T>;

const useLoader = <TData = any, Params = any, E = any>(
  loaderFn: LoaderFn<Params, TData>,
  options: LoaderOptions<Params> = { params: undefined } as any,
) => {
  const context = useContext(RuntimeReactContext);
  const isSSRRender = Boolean(context.ssr);

  const { loaderManager } = context;
  const loaderRef = useRef<Loader>();
  const unlistenLoaderChangeRef = useRef<(() => void) | null>(null);

  // SSR render should ignore `_cache` prop
  if (isSSRRender && Object.prototype.hasOwnProperty.call(options, '_cache')) {
    delete (options as any)._cache;
  }

  const load = useCallback(
    (params?: Params) => {
      if (typeof params === 'undefined') {
        return loaderRef.current?.load();
      }

      const id = loaderManager.add(
        () => {
          try {
            const res = loaderFn(context, params);

            if (res instanceof Promise) {
              return res;
            }

            return Promise.resolve(res);
          } catch (e) {
            return Promise.reject(e);
          }
        },
        {
          ...options,
          params,
        },
      );

      loaderRef.current = loaderManager.get(id)!;
      // unsubscribe old loader onChange event
      unlistenLoaderChangeRef.current?.();

      if (isSSRRender) {
        return undefined;
      }

      // skip this loader, then try to unlisten loader change
      if (options.skip) {
        return undefined;
      }

      // do not load data again in CSR hydrate stage if SSR data exists
      if (
        context._hydration &&
        window?._SSR_DATA?.data?.loadersData[id]?.error === null
      ) {
        return undefined;
      }

      const res = loaderRef.current.load();

      unlistenLoaderChangeRef.current = loaderRef.current?.onChange(
        (_status, _result) => {
          setResult(_result);

          if (_status === LoaderStatus.fulfilled) {
            options?.onSuccess?.(_result.data);
          }

          if (_status === LoaderStatus.rejected) {
            options?.onError?.(_result.error);
          }
        },
      );

      return res;
    },
    [options.skip],
  );

  useEffect(
    () => () => {
      unlistenLoaderChangeRef.current?.();
    },
    [],
  );

  useMemo(() => {
    const p = options.params ?? (loaderFn as any).id;

    invariant(
      typeof p !== 'undefined' && p !== null,
      'Params is required in useLoader',
    );
    load(p);
  }, [options.params]);

  const [result, setResult] = useState<{
    loading: boolean;
    reloading: boolean;
    data: TData;
    error: E;
  }>(loaderRef.current!.result);

  return {
    ...result,
    reload: load,
  };
};

export default useLoader;
