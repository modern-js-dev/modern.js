import { serverManager } from '../src';

describe('Default cases', () => {
  it('Have returns plugins', async () => {
    let count = 0;

    serverManager.usePlugin(
      serverManager.createPlugin(() => ({
        prepareApiServer: () => {
          count = 1;
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          return () => {};
        },
      })),
    );

    const runner = await serverManager.init();
    await runner.prepareApiServer({ pwd: '', mode: 'function', config: {} });

    expect(count).toBe(1);
  });
});
