/**
 * 1. 注册构建任务
 * 2. 监听各个构建任务进程中的信息：process.stdout.on('data' | 'error')
 * 3. 分别输出内容
 */
import type { ChildProcess } from 'child_process';
import EventEmitter from 'events';
import { chalk } from '@modern-js/utils';
import { ReadlineUtils } from '../../../utils/readline';
import type { LoggerTextOption } from './logText';
import { LoggerText } from './logText';

export type STDOUT =
  | ChildProcess['stdout']
  | (NodeJS.WriteStream & {
      fd: 1;
    });
export type STDERR =
  | ChildProcess['stderr']
  | (NodeJS.WriteStream & {
      fd: 2;
    });

interface IAddStdoutConfig {
  event?: { data?: boolean; error?: boolean };
  colors?: {
    data?: (s: string) => string;
    error?: (s: string) => string;
    warning?: (s: string) => string;
  };
}

export class LoggerManager extends EventEmitter {
  private _compilering: boolean;

  private readonly _listeners: STDOUT[];

  constructor() {
    super();
    this._compilering = false;
    this._listeners = [];
  }

  createLoggerText(option: LoggerTextOption) {
    return new LoggerText(option);
  }

  addStdout(
    loggerText: LoggerText,
    stdout: STDOUT,
    config: IAddStdoutConfig = {},
  ) {
    const {
      event = { data: true, error: true },
      colors = {
        data: chalk.green,
        error: chalk.red,
        warning: chalk.yellow,
      },
    } = config;
    if (event.data) {
      stdout?.on('data', chunk => {
        const data = chunk.toString();
        const content = colors.data ? colors.data(data) : chalk.green(data);
        loggerText.append(content);
        this.emit('data');
      });
    }

    if (event.error) {
      stdout?.on('error', error => {
        console.info('error');
        const data = error.message;
        const content = colors.error ? colors.error(data) : chalk.red(data);
        loggerText.append(content);
        loggerText.errorHappen();
        this.emit('data');
      });
    }

    this._listeners.push(stdout);
  }

  addStderr(
    loggerText: LoggerText,
    stderr: STDERR,
    color: (s: string) => string = chalk.red,
  ) {
    stderr?.on('data', chunk => {
      const data = chunk.toString();
      loggerText.append(color(data));
      loggerText.errorHappen();
      this.emit('data');
    });
  }

  showCompiling() {
    if (!this._compilering) {
      this._compilering = true;
      console.info(chalk.green`Compiling in progress...`);
    }
  }

  disappearCompiling() {
    if (this._compilering) {
      ReadlineUtils.clearLine(process.stdout);
      this._compilering = false;
    }
  }

  listenDateAndShow(
    logTexts: LoggerText[],
    // stdout: NodeJS.WriteStream & {
    //   fd: 1;
    // } = process.stdout,
  ) {
    this.on('data', () => {
      this.disappearCompiling();
      const content = logTexts.map(logtext => logtext.value).join('');
      // 每次更新，使用新的内容覆盖旧的内容，有几率出现内容错乱问题
      console.info(content);
    });
    return () => {
      // eslint-disable-next-line no-process-exit
      process.exit(0);
    };
  }
}
