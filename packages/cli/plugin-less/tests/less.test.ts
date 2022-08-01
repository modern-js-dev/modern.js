import type { NormalizedConfig } from '@modern-js/core';
import { getLessLoaderOptions } from '../src/options';

describe('less loader options', () => {
  test('should allow to using addExcludes to exclude some files', () => {
    const { excludes } = getLessLoaderOptions({
      tools: {
        less(
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
