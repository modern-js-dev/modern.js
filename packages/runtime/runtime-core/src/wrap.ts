import React from 'react';
import { runtime, Plugin } from './plugin';
import { RuntimeReactContext } from './runtime-context';

export type WrapOptions = Record<string, unknown>;

export const initialWrapper = (plugins: Plugin[], manager = runtime) => {
  manager.usePlugin(...plugins);

  return <P = Record<string, unknown>>(
    App: React.ComponentType<P>,
    config: WrapOptions,
  ) => wrap(App, config, manager);
};

export const wrap = <P = Record<string, unknown>>(
  App: React.ComponentType<P>,
  // eslint-disable-next-line no-empty-pattern
  {}: WrapOptions,
  manager = runtime,
) => {
  const runner = manager.init();

  const WrapperComponent: React.ComponentType<P> = props => {
    const element = React.createElement(App, { ...props }, props.children);

    return runner.provide(
      { element, props: { ...props }, context: {} as any },
      {
        onLast: ({ element }) => element,
      },
    );
  };

  return runner.hoc(
    { App: WrapperComponent },
    {
      onLast: ({ App }) => {
        const WrapComponent = ({ context, ...props }: any) =>
          React.createElement(
            RuntimeReactContext.Provider,
            { value: context },
            React.createElement(App, props),
          );

        return WrapComponent;
      },
    },
  );
};
