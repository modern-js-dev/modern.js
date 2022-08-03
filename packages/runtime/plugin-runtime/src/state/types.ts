import { createStore } from '@modern-js-reduck/store';
import { ReduxLoggerOptions } from 'redux-logger';

export type PluginOptions = Parameters<typeof createStore>[0] & {
  /**
   * If it's false, the logger will be disabled.
   * If it's a object, it means options will pass to createLogger function
   */
  logger?: false | ReduxLoggerOptions;
  // todo: archive effects params
  effects?: any;
  /**
   * Default: false
   * When it's true, will remove immer plugin
   */
  disableImmer?: boolean;
  // todo: archive devtools params
  devtools?: any;
};
