import React from 'react';
import { bootstrap } from '../src/compatible';

describe('bootstrap', () => {
  it('Only return App Comoonent by `createApp`', async () => {
    function App() {
      return <div>App</div>;
    }

    const result = await bootstrap(App);
    expect(React.isValidElement(result as any)).toBe(true);
  });

  it('bootstrap with root id', async () => {
    const root = document.createElement('div');
    function App() {
      return <div>App</div>;
    }
    await bootstrap(App, root);
    expect(root.innerHTML).toEqual('<div>App</div>');
  });

  it('bootstrap with error root id', async () => {
    function App() {
      return <div>App</div>;
    }
    expect(async () => {
      await bootstrap(App, {});
    }).rejects.toThrowError(
      '`bootstrap` needs id in browser environment, it needs to be string or element',
    );
  });
});
