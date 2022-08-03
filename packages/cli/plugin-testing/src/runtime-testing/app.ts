import React from 'react';
import { createApp } from '@modern-js/runtime';
import type { UserConfig } from '@modern-js/core';
import { MODERNJS_CONFIG_KEY } from '../constant';
import resolvePlugins from './resolvePlugins';

interface CreateAppProps {
  entry?: string;
  children?: React.ReactElement;
}

class ModernRuntime {
  private options: UserConfig;

  constructor(options: UserConfig) {
    this.options = options;
  }

  public init(options: UserConfig) {
    this.options = options;
  }

  public createApp(props?: CreateAppProps) {
    const { entry, children } = props || {};
    let runtimeFeatures = this.options?.runtime;

    if (entry) {
      runtimeFeatures = {
        ...(runtimeFeatures || {}),
        ...this.options.runtimeByEntries?.[entry],
      };
    }

    const Component = (): React.ReactElement | null => {
      if (!children) {
        return null;
      }

      return children;
    };

    return createApp({
      plugins: resolvePlugins(runtimeFeatures || {}),
    })(Component);
  }
}

export default new ModernRuntime((global as any)[MODERNJS_CONFIG_KEY] || {});
