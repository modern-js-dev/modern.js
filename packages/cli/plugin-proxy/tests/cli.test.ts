import path from 'path';
import { manager } from '@modern-js/core';
import plugin from '../src';

const root = path.normalize(path.resolve(__dirname, '../../../../'));
expect.addSnapshotSerializer({
  test: val =>
    typeof val === 'string' &&
    (val.includes('modern.js') ||
      val.includes('node_modules') ||
      val.includes(root)),
  print: val =>
    // eslint-disable-next-line no-nested-ternary
    typeof val === 'string'
      ? // eslint-disable-next-line no-nested-ternary
        val.includes('node_modules')
        ? `"${val.replace(/.+node_modules/, '')}"`
        : val.includes('modern.js')
        ? `"${val.replace(/.+modern\.js/, '')}"`
        : `"${val.replace(root, '')}"`
      : (val as string),
});

describe('plugin proxy test', () => {
  it('schema', async () => {
    const main = manager.clone().usePlugin(plugin);
    const runner = await main.init();
    const result = await runner.validateSchema();

    expect(result).toMatchSnapshot();
  });

  it('config', async () => {
    const main = manager.clone().usePlugin(plugin);
    const runner = await main.init();
    const result = await runner.config();
    expect(result).toMatchSnapshot();
  });
});
