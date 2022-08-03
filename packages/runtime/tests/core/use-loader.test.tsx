import React, { useRef, useState } from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { useLoader, createApp } from '../../src/core';

const loaderCount = jest.fn();
const sleep = (t: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, t));

const App = () => {
  const countRef = useRef<number>(0);

  const { data, loading, reloading, error, reload } = useLoader(
    async () => {
      loaderCount();
      await sleep(800);
      return Promise.resolve(++countRef.current);
    },
    { params: '1' },
  );

  return (
    <div>
      <div
        onClick={() => {
          reload();
        }}
      >
        reload
      </div>
      {JSON.stringify({ data, loading, reloading, error })}
    </div>
  );
};

function App1() {
  const countRef = useRef<number>(0);

  const { reloading, data, loading, error, reload } = useLoader(
    async () => {
      loaderCount();
      return Promise.resolve(++countRef.current);
    },
    { params: '1' },
  );

  return (
    <div>
      <div onClick={() => reload()}>reload1</div>
      {JSON.stringify({ data, loading, reloading, error })}
    </div>
  );
}

function App2() {
  const countRef = useRef<number>(0);
  const [params, setParams] = useState<string>('2');

  const { reloading, data, loading, error, reload } = useLoader(
    async () => {
      loaderCount();
      return Promise.resolve(++countRef.current);
    },
    { params },
  );

  return (
    <div>
      <div onClick={() => setParams('3')}>update params</div>
      <div onClick={() => reload()}>reload2</div>
      {JSON.stringify({ data, loading, reloading, error })}
    </div>
  );
}

function App3() {
  const { data, loading, reloading, error, reload } = useLoader(
    async (_, params) => {
      loaderCount();
      return Promise.resolve(params);
    },
    { params: 55555 },
  );

  return (
    <div>
      <div onClick={() => reload(666666)}>reload3</div>
      {JSON.stringify({ data, loading, reloading, error })}
    </div>
  );
}

beforeEach(() => loaderCount.mockReset());

describe('test useLoader', () => {
  test('userLoader return data、loading、error', async () => {
    const AppWrapper = createApp({ plugins: [] })(App);
    const result = render(<AppWrapper />);

    expect(result.asFragment()).toMatchSnapshot();

    await act(() => sleep(1000));

    expect(result.asFragment()).toMatchSnapshot();

    expect(loaderCount).toBeCalledTimes(1);
  });

  test('reload should works', async () => {
    const AppWrapper = createApp({ plugins: [] })(App);
    const result = render(<AppWrapper />);

    await act(() => sleep(1000));

    fireEvent.click(result.getAllByText(/^reload$/)[0]);

    await act(() => sleep(1000));

    expect(result.asFragment()).toMatchSnapshot();
  });

  test('same loader will integrate to one', async () => {
    const AppWrapper = createApp({ plugins: [] })(() => (
      <>
        <App />
        <App1 />
      </>
    ));
    const result = render(<AppWrapper />);

    await act(() => sleep(1000));
    expect(result.asFragment()).toMatchSnapshot();

    fireEvent.click(result.getByText('reload1'));

    await act(() => sleep(1000));

    expect(loaderCount).toBeCalledTimes(2);
    expect(result.asFragment()).toMatchSnapshot();
  });

  test('it should exec loader two times when has two different key', async () => {
    const AppWrapper = createApp({ plugins: [] })(() => (
      <>
        <App />
        <App1 />
        <App2 />
      </>
    ));
    const result = render(<AppWrapper />);

    await act(() => sleep(1000));

    expect(result.asFragment()).toMatchSnapshot();

    expect(loaderCount).toBeCalledTimes(2);

    fireEvent.click(result.getByText('reload1'));
    await act(() => sleep(1000));

    expect(loaderCount).toBeCalledTimes(3);
    expect(result.asFragment()).toMatchSnapshot();

    fireEvent.click(result.getByText('reload2'));
    await act(() => sleep(1000));

    expect(loaderCount).toBeCalledTimes(4);
    expect(result.asFragment()).toMatchSnapshot();
  });

  test('should re-execute loader when params updated', async () => {
    const AppWrapper = createApp({ plugins: [] })(() => (
      <>
        <App2 />
      </>
    ));
    const result = render(<AppWrapper />);

    await act(() => sleep(1000));
    fireEvent.click(result.getByText('update params'));
    await act(() => sleep(1000));
    expect(result.asFragment()).toMatchSnapshot();
  });

  test('reload can pass params', async () => {
    const AppWrapper = createApp({ plugins: [] })(() => <App3 />);
    const result = render(<AppWrapper />);

    await act(() => sleep(1000));
    fireEvent.click(result.getByText('reload3'));
    await act(() => sleep(1000));
    expect(result.asFragment()).toMatchSnapshot();
  });

  test('reloading should be true when reload', async () => {
    const AppWrapper = createApp({ plugins: [] })(() => <App />);
    const result = render(<AppWrapper />);

    expect(result.asFragment()).toMatchSnapshot();
    await act(() => sleep(1000));
    fireEvent.click(result.getAllByText(/^reload$/)[0]);
    expect(result.asFragment()).toMatchSnapshot();
  });
});
