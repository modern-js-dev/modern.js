import { hook } from '../src/exports/server';

describe('runtime export', () => {
  it('should return self after hook', () => {
    const fn = () => {
      // empty
    };
    expect(hook(fn)).toBe(fn);
  });
});
