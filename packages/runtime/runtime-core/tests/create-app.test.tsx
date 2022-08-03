import React from 'react';
import { render } from '@testing-library/react';
import {
  Plugin,
  initialWrapper,
  createRuntime,
  createApp,
  createPlugin,
  useRuntimeContext,
} from '../src';

declare module '..' {
  interface RuntimeContext {
    test?: string;
  }
}

describe('create-app', () => {
  it('base, usage', () => {
    const runtime = createRuntime();
    const wrap = initialWrapper([], runtime);

    interface Props {
      test: number;
    }
    function App({ test }: Props) {
      return <div>App:{test}</div>;
    }

    const AppWrapper = wrap(App, { context: {} as any });

    const { container } = render(<AppWrapper test={1} />);
    expect(container.firstChild?.textContent).toEqual('App:1');
    expect(container.innerHTML).toBe('<div>App:1</div>');
  });

  it('hoc', () => {
    const runtime = createRuntime();
    const wrap = initialWrapper(
      [
        runtime.createPlugin(() => ({
          hoc:
            ({ App: App1 }) =>
            ({ test }: Props) =>
              <App1 test={test + 1} />,
        })),
      ],
      runtime,
    );

    interface Props {
      test: number;
    }
    function App({ test }: Props) {
      return <div>App:{test}</div>;
    }

    const AppWrapper = wrap(App, { context: {} as any });

    const { container } = render(<AppWrapper test={1} />);
    expect(container.firstChild?.textContent).toEqual('App:2');
    expect(container.innerHTML).toBe('<div>App:2</div>');
  });

  it('provide', () => {
    const runtime = createRuntime();
    const wrap = initialWrapper(
      [
        runtime.createPlugin(() => ({
          provide: ({ element }) => <div>{element}</div>,
        })),
      ],
      runtime,
    );

    interface Props {
      test: number;
    }
    function App({ test }: Props) {
      return <div>App:{test}</div>;
    }

    const AppWrapper = wrap(App, { context: {} as any });

    const { container } = render(<AppWrapper test={1} />);
    expect(container.firstChild?.textContent).toEqual('App:1');
    expect(container.innerHTML).toBe('<div><div>App:1</div></div>');
  });

  it('runtime context', () => {
    const runtime = createRuntime();
    const wrap = initialWrapper(
      [
        runtime.createPlugin(() => ({
          provide: ({ element }) => <div>{element}</div>,
          hoc: ({ App: App1 }, next) => next({ App: App1 }),
          client: ({ App: App1, rootElement }, next) =>
            next({ App: App1, rootElement }),
        })),
      ],
      runtime,
    );

    interface Props {
      test: number;
    }

    function App({ test }: Props) {
      return <div>App:{test}</div>;
    }
    const AppWrapper = wrap(App, {});

    const { container } = render(<AppWrapper test={1} />);
    expect(container.firstChild?.textContent).toEqual('App:1');
    expect(container.innerHTML).toBe('<div><div>App:1</div></div>');
  });

  it('createApp', () => {
    const wrap = createApp({
      plugins: [
        createPlugin(() => ({
          provide: ({ element }) => <div>{element}</div>,
          hoc: ({ App: App1 }, next) => next({ App: App1 }),
          client: ({ App: App1, rootElement }, next) =>
            next({ App: App1, rootElement }),
        })),
      ],
    });

    interface Props {
      test: number;
    }
    function App({ test }: Props) {
      return <div>App:{test}</div>;
    }

    const AppWrapper = wrap(App);

    const { container } = render(<AppWrapper test={1} />);
    expect(container.firstChild?.textContent).toEqual('App:1');
    expect(container.innerHTML).toBe('<div><div>App:1</div></div>');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const NullWrapper = wrap(null);
    expect(React.isValidElement(<NullWrapper />)).toBe(true);
  });

  it('createApp with plugin options', () => {
    const plugin = (): Plugin => ({
      setup: () => ({
        provide: ({ element }) => <div>{element}</div>,
        hoc: ({ App: App1 }, next) => next({ App: App1 }),
        client: ({ App: App1, rootElement }, next) =>
          next({ App: App1, rootElement }),
      }),
    });

    const wrap = createApp({
      plugins: [plugin()],
    });

    interface Props {
      test: number;
    }
    function App({ test }: Props) {
      return <div>App:{test}</div>;
    }

    const AppWrapper = wrap(App);

    const { container } = render(<AppWrapper test={1} />);
    expect(container.firstChild?.textContent).toEqual('App:1');
    expect(container.innerHTML).toBe('<div><div>App:1</div></div>');
  });

  it('useRuntimeContext', () => {
    const TEST_STRING = 'this is a test context';

    function App() {
      const { test } = useRuntimeContext();
      return <div>{test}</div>;
    }

    // a custom plugin just for inject context
    const plugin = (): Plugin => ({
      setup: () => ({
        pickContext: ({ context, pickedContext }, next) =>
          next({
            context,
            pickedContext: {
              ...pickedContext,
              test: TEST_STRING, // check this
            },
          }),
      }),
    });

    const wrap = createApp({
      plugins: [plugin()],
    });

    const AppWrapper = wrap(App);

    const { container } = render(<AppWrapper />);
    expect(container.textContent).toBe(TEST_STRING);
  });
});
