import * as path from 'path';
import * as Event from 'events';
import { fs } from '@modern-js/utils';
import { transformStyle } from './build';
import type { IBuildOption, ICompilerResult } from './types';
import { watch, ChangeType } from './watch';

export const BuildWatchEvent = {
  firstCompiler: 'first-compiler',
  compilering: 'compilering',
  watchingCompiler: 'watching-compiler',
};

export class BuildWatchEmitter extends Event.EventEmitter {
  private _initFn!: (emitter: BuildWatchEmitter) => Promise<void>;

  setInitFn(fn: (emitter: BuildWatchEmitter) => Promise<void>) {
    this._initFn = fn;
  }

  async watch() {
    if (typeof this._initFn === 'function') {
      await this._initFn(this);
    }
  }
}

export const transformStyleInWatchMode = (option: IBuildOption) => {
  const buildWatchEmitter = new BuildWatchEmitter();
  buildWatchEmitter.setInitFn(async () => {
    buildWatchEmitter.emit(BuildWatchEvent.compilering);
    const firstResult = (await transformStyle(option)) as ICompilerResult;
    buildWatchEmitter.emit(BuildWatchEvent.firstCompiler, firstResult);
    watch(option.stylesDir, async ({ changeType, changedFilePath }) => {
      buildWatchEmitter.emit(BuildWatchEvent.compilering);
      if (changeType === ChangeType.UNLINK) {
        const removeFile = path.normalize(
          `${option.outDir}/${path.relative(
            option.stylesDir,
            changedFilePath,
          )}`,
        );
        fs.removeSync(removeFile.replace(path.extname(removeFile), '.css'));
      }
      const result = (await transformStyle(option)) as ICompilerResult;
      buildWatchEmitter.emit(BuildWatchEvent.watchingCompiler, result);
    });
  });
  return buildWatchEmitter;
};
