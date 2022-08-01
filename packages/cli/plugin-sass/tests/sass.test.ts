import type { NormalizedConfig } from '@modern-js/core';
import { getSassLoaderOptions } from '../src/options';

describe('sass loader options', () => {
  test('should allow to using addExcludes to exclude some files', () => {
    const { excludes } = getSassLoaderOptions({
      tools: {
        sass(
          _: unknown,
          {
            addExcludes,
          }: { addExcludes: (excludes: RegExp | RegExp[]) => void },
        ) {
          addExcludes(/foo/);
          addExcludes([/bar/, /baz/]);
        },
      },
    } as NormalizedConfig);

    expect(excludes).toEqual([/foo/, /bar/, /baz/]);
  });
});
