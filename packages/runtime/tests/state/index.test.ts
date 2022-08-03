import plugin from '../../src/state';
import cliPlugin from '../../src/state/cli';

describe('plugin-state', () => {
  it('default', () => {
    expect(plugin).toBeDefined();
    expect(cliPlugin).toBeDefined();
  });
});
