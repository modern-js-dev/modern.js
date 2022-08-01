import * as path from 'path';
import { chokidar } from '@modern-js/utils';

export type ChangeTypeValueT = 'add' | 'unlink' | 'change';

export const ChangeType: Record<'ADD' | 'UNLINK' | 'CHANGE', ChangeTypeValueT> =
  {
    ADD: 'add',
    UNLINK: 'unlink',
    CHANGE: 'change',
  };

type RunTaskType = (option: {
  changedFilePath: string;
  changeType: ChangeTypeValueT;
}) => Promise<void>;

export const watch = (watchDir: string, runTask: RunTaskType, ignored = []) => {
  let ready = false;
  const watcher = chokidar.watch(`${watchDir}/**/*.{css,less,sass,scss}`, {
    ignored,
  });

  watcher.on('ready', () => (ready = true));

  watcher.on('change', async filePath => {
    const changedFilePath = path.resolve(filePath);
    await runTask({ changedFilePath, changeType: ChangeType.CHANGE });
  });

  watcher.on('add', async filePath => {
    const changedFilePath = path.resolve(filePath);
    if (ready) {
      await runTask({ changedFilePath, changeType: ChangeType.ADD });
    }
  });

  watcher.on('unlink', async filePath => {
    const changedFilePath = path.resolve(filePath);
    await runTask({ changedFilePath, changeType: ChangeType.UNLINK });
  });

  watcher.on('error', err => {
    throw err;
  });
};
