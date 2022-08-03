import React from 'react';
import { createApp } from '@modern-js/runtime';
import type { Plugin } from '@modern-js/runtime';
import { state, router } from '@modern-js/runtime/plugins';
import type { RouterConfig } from '@modern-js/runtime/router';
import type { StoryFn as StoryFunction } from '@storybook/addons';
import type { IConfig } from '../type';
import { getStateOption } from './state';

export const WrapProviders = (
  storyFn: StoryFunction<JSX.Element>,
  config: IConfig,
) => React.createElement(_createApp(storyFn, config));

const _createApp = (StoryFn: StoryFunction<JSX.Element>, options: IConfig) => {
  const AppWrapper = createApp({
    plugins: resolvePlugins(options.modernConfigRuntime),
  })(StoryFn);
  // bootstrap(AppWrapper, 'root');
  return AppWrapper;
};
const allowedRuntimeAPI = {
  router: 'router',
  state: 'state',
};
const allowedRuntimeAPIValues = Object.values(allowedRuntimeAPI);

export const resolvePlugins = (runtime: IConfig['modernConfigRuntime']) => {
  const plugins: Plugin[] = [];

  if (!runtime) {
    return plugins;
  }

  Object.keys(runtime).forEach(api => {
    if (allowedRuntimeAPIValues.includes(api)) {
      if (api === allowedRuntimeAPI.state) {
        if (typeof runtime.state === 'boolean') {
          if (runtime.state) {
            plugins.push(state(getStateOption(true)));
          }
        } else if (typeof runtime.state === 'object') {
          plugins.push(state(getStateOption(runtime.state)));
        }
      } else if (api === allowedRuntimeAPI.router) {
        plugins.push(router(runtime.router as RouterConfig));
      }
    }
  });

  return plugins;
};
