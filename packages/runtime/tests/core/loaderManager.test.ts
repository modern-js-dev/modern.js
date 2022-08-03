import { createLoaderManager } from '../src/loader/loaderManager';

describe('loaderManager', () => {
  test('basic usage', async () => {
    const initialData = {
      loading: false,
      reloading: false,
      data: 'hello world',
      error: null,
      _error: null,
    };

    const loaderManager = createLoaderManager({
      [JSON.stringify('1')]: initialData,
    });

    const { add, get, awaitPendingLoaders } = loaderManager;

    add(() => Promise.resolve('hello modern'), { params: '1' });
    add(() => Promise.resolve('hello modern2'), {
      params: '2',
      initialData: initialData.data,
    });
    const error = new Error('error occurs');
    add(() => Promise.reject(error), {
      params: '3',
      initialData: initialData.data,
    });

    const loader1 = get(JSON.stringify('1'));
    const loader2 = get(JSON.stringify('2'));
    const loader3 = get(JSON.stringify('3'));

    expect(loader1?.result).toEqual(initialData);
    // error is initialized to undefined when initialData doesn't set this field.
    expect(loader2?.result).toEqual({
      ...initialData,
      error: undefined,
      _error: undefined,
    });

    loader1?.load();
    loader2?.load();
    loader3?.load();

    const result = await awaitPendingLoaders();

    expect(result[JSON.stringify('1')]).toEqual({
      loading: false,
      reloading: false,
      data: 'hello modern',
      error: null,
      _error: null,
    });
    expect(result[JSON.stringify('2')]).toEqual({
      loading: false,
      reloading: false,
      data: 'hello modern2',
      error: null,
      _error: null,
    });
    expect(result[JSON.stringify('3')]).toEqual({
      loading: false,
      reloading: false,
      data: null,
      error: 'error occurs',
      _error: error,
    });
  });
});
