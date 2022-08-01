import { transformStyle } from './build';
import { transformStyleInWatchMode, BuildWatchEmitter } from './build-watch';
import type { IBuildOption } from './types';

export * from './types';

export function styleCompiler(
  option: IBuildOption & { watch?: false },
): ReturnType<typeof transformStyle>;
export function styleCompiler(
  option: IBuildOption & { watch: true },
): BuildWatchEmitter;
export function styleCompiler(option: IBuildOption & { watch?: boolean }) {
  if (!option.watch) {
    return transformStyle(option);
  }

  return transformStyleInWatchMode(option);
}

export { BuildWatchEvent } from './build-watch';
