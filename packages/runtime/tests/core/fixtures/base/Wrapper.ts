import { initialRuntime } from '../../..';
import App from './App';

const IS_BROWSER = process.env.MODERN_TARGET === 'browser';
const MOUNT_ID = 'root';

const plugins = [] as any[];
const config = {} as any;

const { wrap, render } = initialRuntime(plugins);

const Wrapper = wrap(App, { config });

if (IS_BROWSER) {
  render.clientRender(
    { Component: Wrapper, config },
    document.getElementById(MOUNT_ID)!,
  );
}

export default Wrapper;

export const { serverRender } = render;
