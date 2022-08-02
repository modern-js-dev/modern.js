import path from 'path';
import type { Stats } from 'fs';
import {
  findExists,
  fs,
  createDebugger,
  CONFIG_FILE_EXTENSIONS,
  CONFIG_CACHE_DIR,
  globby,
} from '@modern-js/utils';
import {
  bundleRequire,
  defaultGetOutputFile,
} from '@modern-js/node-bundle-require';

const debug = createDebugger('load-config');

export const CONFIG_FILE_NAME = 'modern.config';

export const PACKAGE_JSON_CONFIG_NAME = 'modernConfig';

/**
 * Get user config from package.json.
 * @param appDirectory - App root directory.
 * @returns modernConfig or undefined
 */
export const getPackageConfig = <T>(
  appDirectory: string,
  packageJsonConfig?: string,
) => {
  const json = JSON.parse(
    fs.readFileSync(path.resolve(appDirectory, './package.json'), 'utf8'),
  );

  return json[packageJsonConfig ?? PACKAGE_JSON_CONFIG_NAME] as T | undefined;
};

/**
 * Get the file dependencies by module.children, ignore file path in node_modules and this monorepo packages default.
 * @param filePath - Absolute file path.
 * @returns File dependencies array.
 */
export const getDependencies = (filePath: string): string[] => {
  const mod: NodeModule | undefined = require.cache[filePath];

  if (!mod) {
    debug(`${filePath} has not been required yet`);
    return [];
  }

  const deps: string[] = [];

  if (!/\/node_modules\/|\/modern-js\/packages\//.test(mod.id)) {
    deps.push(mod.id);
    for (const child of mod.children) {
      deps.push(...getDependencies(child.id));
    }
  }

  return deps;
};

/**
 *
 * @param targetDir target dir
 * @param overtime Unit of second
 */
export const clearFilesOverTime = async (
  targetDir: string,
  overtime: number,
) => {
  // when stats is true, globby return Stats[]
  const files = (await globby(`${targetDir}/**/*`, {
    stats: true,
    absolute: true,
  })) as unknown as { stats: Stats; path: string }[];
  const currentTime = Date.now();
  if (files.length > 0) {
    for (const file of files) {
      if (currentTime - file.stats.birthtimeMs >= overtime * 1000) {
        fs.unlinkSync(file.path);
      }
    }
  }
};

const bundleRequireWithCatch = async (
  configFile: string,
  { appDirectory }: { appDirectory: string },
): Promise<any> => {
  try {
    const mod = await bundleRequire(configFile, {
      autoClear: false,
      root: appDirectory,
      getOutputFile: async (filePath: string) => {
        const defaultOutputFileName = path.basename(
          await defaultGetOutputFile(filePath),
        );
        const outputPath = path.join(appDirectory, CONFIG_CACHE_DIR);
        // 10 min
        const timeLimit = 10 * 60;
        await clearFilesOverTime(outputPath, timeLimit);
        return path.join(outputPath, defaultOutputFileName);
      },
    });

    return mod;
  } catch (e) {
    if (e instanceof Error) {
      e.message = `Get Error while loading config file: ${configFile}, please check it and retry.\n${
        e.message || ''
      }`;
    }
    throw e;
  }
};

export const getConfigFilePath = (appDirectory: string, filePath?: string) => {
  if (filePath) {
    if (path.isAbsolute(filePath)) {
      return filePath;
    }
    return path.resolve(appDirectory, filePath);
  }
  return findExists(
    CONFIG_FILE_EXTENSIONS.map(extension =>
      path.resolve(appDirectory, `${CONFIG_FILE_NAME}${extension}`),
    ),
  );
};

/**
 * Parse and load user config file, support extensions like .ts, mjs, js, ejs.
 * @param appDirectory - App root directory, from which start search user config file.
 * @param filePath - Specific absolute config file path.
 * @returns Object contain config file path, user config object and dependency files used by config file.
 */
export const loadConfig = async <T>(
  appDirectory: string,
  filePath?: string,
  packageJsonConfig?: string,
): Promise<{
  path: string | false;
  config?: T;
  dependencies?: string[];
  pkgConfig?: T;
}> => {
  const configFile = getConfigFilePath(appDirectory, filePath);
  const pkgConfig = getPackageConfig<T>(appDirectory, packageJsonConfig);

  let config: T | undefined;

  const dependencies = pkgConfig
    ? [path.resolve(appDirectory, './package.json')]
    : [];

  if (configFile) {
    delete require.cache[configFile];

    const mod = await bundleRequireWithCatch(configFile, { appDirectory });

    config = mod.default || mod;

    // TODO: get deps.
    // dependencies = dependencies.concat(getDependencies(configFile));
  }

  return {
    path: configFile,
    config,
    pkgConfig,
    dependencies,
  };
};
