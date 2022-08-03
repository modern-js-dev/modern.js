import { runtime, Plugin } from '../../src/core/plugin';
import { initialWrapper } from './wrap';
import { initialRender } from './render';

export const initialRuntime = (plugins: Plugin[], manager = runtime) => ({
  wrap: initialWrapper(plugins, manager),
  render: initialRender(plugins, manager),
});
