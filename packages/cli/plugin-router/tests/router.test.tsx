import React from 'react';
import { createApp, createPlugin } from '@modern-js/runtime-core';
import { render, fireEvent, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import createRouterPlugin from '../src/runtime';
import { useHistory } from '../src';
import { DefaultNotFound } from '../src/runtime/DefaultNotFound';

describe('@modern-js/plugin-router', () => {
  it('base usage', () => {
    const AppWrapper = createApp({
      plugins: [
        createPlugin(() => ({
          hoc: ({ App: App1 }, next) => next({ App: App1 }),
        })),
        createRouterPlugin({}),
      ],
    })(App);

    interface Props {
      test: number;
    }
    function App({ test }: Props) {
      return <div>App:{test}</div>;
    }

    const { container } = render(<AppWrapper test={1} />);
    expect(container.firstChild?.textContent).toBe('App:1');
    expect(container.innerHTML).toBe('<div>App:1</div>');
  });

  it('pages', () => {
    const AppWrapper = createApp({
      plugins: [
        createPlugin(() => ({
          hoc: ({ App: App1 }, next) => next({ App: App1 }),
        })),
        createRouterPlugin({
          routesConfig: { routes: [{ path: '/', component: App as any }] },
        }),
      ],
    })(App);

    interface Props {
      test: number;
    }
    function App({ test }: Props) {
      return <div>App:{test}</div>;
    }

    const { container } = render(<AppWrapper test={1} />);
    expect(container.firstChild?.textContent).toBe('App:1');
    expect(container.innerHTML).toBe('<div>App:1</div>');
  });

  it('pages with App.init', () => {
    const App = (props: { Component: React.FC }) => {
      const { Component, ...pageProps } = props;
      return (
        <div>
          <Component {...pageProps} />
        </div>
      );
    };

    function RouterApp() {
      return <div>Router App</div>;
    }

    const mockCallback = jest.fn();
    App.init = mockCallback;

    const AppWrapper = createApp({
      plugins: [
        createPlugin(() => ({
          hoc: ({ App: App1 }, next) => next({ App: App1 }),
        })),
        createRouterPlugin({
          routesConfig: {
            routes: [{ path: '/', component: RouterApp as any }],
            globalApp: App,
          },
        }),
      ],
    })();

    render(<AppWrapper />);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('custom history', () => {
    const history = createBrowserHistory();
    const customHistory = {
      ...history,
      push: jest.fn(),
    };

    const AppWrapper = createApp({
      plugins: [
        createPlugin(() => ({
          hoc: ({ App: App1 }, next) => next({ App: App1 }),
        })),
        createRouterPlugin({
          history: customHistory,
        }),
      ],
    })(App);

    interface Props {
      test: number;
    }
    function App({ test }: Props) {
      const _history = useHistory();
      return (
        <div>
          App:{test}
          <button
            type="button"
            onClick={() => {
              _history.push('/');
            }}
            data-testid="nav"
          >
            Go
          </button>
        </div>
      );
    }

    const { container } = render(<AppWrapper test={1} />);
    expect(container.firstChild?.textContent).toContain('App:1');
    fireEvent.click(screen.getByTestId('nav'));
    expect(customHistory.push).toHaveBeenCalledTimes(1);
  });

  it('hash router could work', () => {
    function App({ test }: any) {
      return <div>App:{test}</div>;
    }

    const AppWrapper = createApp({
      plugins: [
        createPlugin(() => ({
          hoc: ({ App: App1 }, next) => next({ App: App1 }),
        })),
        createRouterPlugin({
          routesConfig: { routes: [{ path: '/', component: App as any }] },
          supportHtml5History: false, // use hash router
        }),
      ],
    })(App);

    const { container } = render(<AppWrapper test={1} />);
    expect(container.firstChild?.textContent).toBe('App:1');
    expect(container.innerHTML).toBe('<div>App:1</div>');
  });
  it('DefaultNotFound', () => {
    const { container } = render(<DefaultNotFound />);
    expect(container.firstChild?.textContent).toEqual('404');
  });
});
