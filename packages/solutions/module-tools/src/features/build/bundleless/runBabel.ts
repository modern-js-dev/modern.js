import path from 'path';
import { Import, glob, fs, chalk, globby, slash } from '@modern-js/utils';
import type { PluginAPI } from '@modern-js/core';
import type {
  BabelOptions,
  IVirtualDist,
  ICompilerResult,
  BuildWatchEmitter,
  ICompilerMessageDetail,
} from '@modern-js/babel-compiler';
import { Format, Target } from '../../../schema/types';
import { InternalBuildError } from '../error';
import type { NormalizedBundlelessBuildConfig } from '../types';
import type { ITsconfig } from '../../../types';
import { SectionTitleStatus, watchSectionTitle } from '../utils';
import { resolveBabelConfig } from '../../../utils/babel';
import { readTsConfig } from '../../../utils/tsconfig';

export class BabelBuildError extends Error {
  public readonly summary?: string;

  public readonly details?: ICompilerMessageDetail[];

  constructor(
    message: string,
    opts?: {
      summary?: string;
      details?: ICompilerMessageDetail[];
    },
  ) {
    super(message);

    Error.captureStackTrace(this, this.constructor);

    this.summary = opts?.summary;
    this.details = opts?.details;
  }

  toString() {
    return this.formatError().join('\n');
  }

  formatError() {
    const msgs: string[] = [];
    const { summary, details = [] } = this;
    msgs.push(chalk.red.bold(summary));

    for (const detail of details) {
      msgs.push(detail.content);
      msgs.push('\n');
    }

    return msgs;
  }
}

const babelCompiler: typeof import('@modern-js/babel-compiler') = Import.lazy(
  '@modern-js/babel-compiler',
  require,
);

interface IBuildSourceCodeConfig {
  appDirectory: string;
  watch?: boolean;
  babelConfig: BabelOptions;
  srcRootDir: string;
  willCompilerDirOrFile: string;
  distDir: string;
  tsconfigPath: string;
}

const getExts = (isTs: boolean, tsconfig: ITsconfig | null) => {
  // TODO: 是否受控tsconfig.json 里的jsx配置
  let exts = [];
  if (isTs) {
    exts = tsconfig?.compilerOptions?.allowJs
      ? ['.ts', '.tsx', '.js', '.jsx']
      : ['.ts', '.tsx'];
  } else {
    exts = ['.js', '.jsx'];
  }

  return exts;
};

export const getWillCompilerCode = (
  srcDirOrFile: string,
  option: { tsconfig: ITsconfig | null; isTsProject: boolean },
) => {
  const { tsconfig, isTsProject } = option;
  // 如果是一个文件路径，则直接返回
  if (fs.existsSync(srcDirOrFile) && fs.lstatSync(srcDirOrFile).isFile()) {
    return [srcDirOrFile];
  }

  const exts = getExts(isTsProject, tsconfig);
  const globPattern = `${srcDirOrFile}/**/*{${exts.join(',')}}`;
  const files = glob.sync(globPattern, {
    ignore: [`${srcDirOrFile}/**/*.d.ts`],
    absolute: true,
  });

  return files;
};

export const buildSourceCode = async (config: IBuildSourceCodeConfig) => {
  const {
    willCompilerDirOrFile,
    tsconfigPath,
    babelConfig,
    srcRootDir,
    distDir,
    watch,
  } = config;
  const tsconfig = readTsConfig(tsconfigPath);
  const willCompilerFiles = getWillCompilerCode(willCompilerDirOrFile, {
    tsconfig,
    isTsProject: Boolean(tsconfig),
  });
  if (watch) {
    const emitter = await babelCompiler.compiler(
      {
        quiet: true,
        enableVirtualDist: true,
        enableWatch: true,
        rootDir: srcRootDir,
        filenames: willCompilerFiles,
        distDir,
        watchDir: srcRootDir,
        extensions: getExts(Boolean(tsconfig), tsconfig),
        ignore: ['*.d.ts'],
      },
      babelConfig,
    );
    return emitter;
  } else {
    return babelCompiler.compiler(
      {
        quiet: true,
        enableVirtualDist: true,
        rootDir: srcRootDir,
        filenames: willCompilerFiles,
        distDir,
        // enableWatch: watch,
        ignore: ['*.d.ts'],
      },
      babelConfig,
    );
  }
};

const generatorRealFiles = (virtualDists: IVirtualDist[]) => {
  for (const virtualDist of virtualDists) {
    const { distPath, code, sourcemap, sourceMapPath } = virtualDist;
    fs.ensureFileSync(distPath);
    fs.writeFileSync(distPath, code);
    if (sourcemap.length > 0) {
      fs.ensureFileSync(sourceMapPath);
      fs.writeFileSync(sourceMapPath, sourcemap);
    }
  }
};
/**
 * when modern build, only throw Error or silent
 * @param outputResults
 * @param context
 */
const outputDist = (
  outputResults: ICompilerResult,
  context: { format: Format; target: Target },
) => {
  const { code, message, messageDetails, virtualDists = [] } = outputResults;
  if (code === 0) {
    generatorRealFiles(virtualDists);
  } else if (messageDetails && messageDetails.length > 0) {
    const babelError = new BabelBuildError('bundleless failed', {
      summary: message,
      details: messageDetails,
    });

    throw new InternalBuildError(babelError, {
      ...context,
      buildType: 'bundleless',
    });
  }
};

export const jsFileSuffix = ['js', 'jsx', 'ts', 'tsx'];
export const haveNotAnyJsFile = async (sourceDir: string) => {
  const files = await globby(
    slash(`${sourceDir}/**/*.{${jsFileSuffix.join(',')}}`),
  );
  return files.length === 0;
};

export const runBabelBuild = async (
  api: PluginAPI,
  config: NormalizedBundlelessBuildConfig,
) => {
  const {
    bundlelessOptions,
    tsconfig,
    target,
    format,
    outputPath,
    watch,
    sourceMap,
  } = config;
  const { appDirectory } = api.useAppContext();
  const modernConfig = api.useResolvedConfigContext();
  const {
    output: { path: distPath = 'dist' },
  } = modernConfig;
  const { sourceDir = './src' } = bundlelessOptions;
  const sourceAbsDir = path.join(appDirectory, sourceDir);
  const tsconfigPath = path.join(appDirectory, tsconfig);

  if (await haveNotAnyJsFile(sourceAbsDir)) {
    return;
  }

  // TODO: Refactoring based on format and target
  const syntax = target === 'es5' ? 'es5' : 'es6+';
  const type = format === 'cjs' ? 'commonjs' : 'module';
  const titleText = `[Bundleless:Babel: ${format}_${target}]`;
  const buildConfig = {
    format,
    target,
    babelConfig: resolveBabelConfig(
      appDirectory,
      modernConfig,
      sourceMap,
      bundlelessOptions,
      {
        sourceAbsDir,
        tsconfigPath,
        syntax,
        type,
      },
    ),
  };

  const distDir = path.join(appDirectory, distPath, outputPath);
  const result = await buildSourceCode({
    appDirectory,
    distDir,
    srcRootDir: sourceAbsDir,
    willCompilerDirOrFile: sourceAbsDir,
    tsconfigPath,
    babelConfig: buildConfig.babelConfig,
    watch,
  });

  if (watch) {
    const emitter = result as BuildWatchEmitter;
    emitter.on(
      babelCompiler.BuildWatchEvent.firstCompiler,
      (result: ICompilerResult) => {
        if (result.code === 1) {
          console.info(watchSectionTitle(titleText, SectionTitleStatus.Fail));
          console.error(result.message);
          for (const detail of result.messageDetails || []) {
            console.error(detail.content);
          }
        } else {
          generatorRealFiles(result.virtualDists!);
          console.info(
            watchSectionTitle(titleText, SectionTitleStatus.Success),
          );
        }
      },
    );
    emitter.on(
      babelCompiler.BuildWatchEvent.watchingCompiler,
      (result: ICompilerResult) => {
        if (result.code === 1) {
          // console.error(logger.clearFlag);
          console.info(watchSectionTitle(titleText, SectionTitleStatus.Fail));
          console.error(result.message);
          for (const detail of result.messageDetails || []) {
            console.error(detail.content);
          }
          if (
            Array.isArray(result.virtualDists) &&
            result.virtualDists?.length > 0
          ) {
            generatorRealFiles(result.virtualDists);
          }
        } else {
          generatorRealFiles(result.virtualDists!);
          console.info(
            watchSectionTitle(titleText, SectionTitleStatus.Success),
          );
        }
      },
    );
    await emitter.watch();
  } else {
    outputDist(result as ICompilerResult, { target, format });
  }
};
