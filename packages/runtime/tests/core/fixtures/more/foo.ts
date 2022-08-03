import { wrap, render } from './initial';
import App from './App';

const IS_BROWSER = process.env.MODERN_TARGET === 'browser';
const MOUNT_ID = 'root';

const config = {} as any;

const foo = wrap(App, { config });

if (IS_BROWSER) {
  render.clientRender(
    { Component: foo, config },
    document.getElementById(MOUNT_ID)!,
  );
}

export default foo;

export const { serverRender } = render;
