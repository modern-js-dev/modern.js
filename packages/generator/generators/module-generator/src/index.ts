import path from 'path';
import { GeneratorContext, GeneratorCore } from '@modern-js/codesmith';
import { AppAPI } from '@modern-js/codesmith-api-app';
import { JsonAPI } from '@modern-js/codesmith-api-json';
import {
  i18n as commonI18n,
  BaseGenerator,
  ChangesetGenerator,
  Solution,
  ModuleSchema,
  Language,
  DependenceGenerator,
  ModuleActionFunctionsDependencies,
  ActionFunction,
  PackageManager,
  BooleanConfig,
} from '@modern-js/generator-common';
import {
  i18n as utilsI18n,
  getAllPackages,
  validatePackagePath,
  validatePackageName,
  getModuleProjectPath,
  getPackageVersion,
} from '@modern-js/generator-utils';
import { i18n, localeKeys } from '@/locale';

const getGeneratorPath = (generator: string, distTag: string) => {
  if (process.env.CODESMITH_ENV === 'development') {
    return path.dirname(require.resolve(generator));
  } else if (distTag) {
    return `${generator}@${distTag}`;
  }
  return generator;
};

// eslint-disable-next-line max-statements
const handleTemplateFile = async (
  context: GeneratorContext,
  generator: GeneratorCore,
  appApi: AppAPI,
) => {
  const jsonAPI = new JsonAPI(generator);

  const {
    isMonorepoSubProject,
    isPublic = true,
    isLocalPackages,
    projectDir = '',
    enableLess,
    enableSass,
  } = context.config;

  const { outputPath } = generator;

  let packages: string[] = [];

  if (isMonorepoSubProject && !isLocalPackages) {
    try {
      packages = getAllPackages(outputPath);
    } catch (e) {
      generator.logger.debug('get all packages error', e);
      generator.logger.warn(i18n.t(localeKeys.get_packages_error));
    }
  }

  const ans = await appApi.getInputBySchema(
    ModuleSchema,
    context.config,
    {
      packageName: input =>
        validatePackageName(input as string, packages, {
          isMonorepoSubProject,
        }),
      packagePath: input =>
        validatePackagePath(
          input as string,
          path.join(process.cwd(), projectDir),
          { isPublic },
        ),
    },
    {
      packageName: isMonorepoSubProject ? undefined : path.basename(outputPath),
    },
  );

  generator.logger.debug(`inputData=${JSON.stringify(ans)}`, ans);

  const { packageName, packagePath, language, packageManager } = ans;

  const moduleProjectPath = getModuleProjectPath(
    packagePath as string,
    isMonorepoSubProject,
    isPublic,
    isLocalPackages,
  );
  const projectPath = projectDir
    ? path.join(projectDir, moduleProjectPath)
    : moduleProjectPath;

  if (!isMonorepoSubProject) {
    await appApi.runSubGenerator(
      getGeneratorPath(BaseGenerator, context.config.distTag),
    );
  }

  await appApi.forgeTemplate(
    'templates/base-template/**/*',
    undefined,
    resourceKey =>
      resourceKey
        .replace('templates/base-template/', projectPath)
        .replace('language', language as string)
        .replace('.handlebars', ''),
    {
      name: packageName as string,
      language,
      isTs: language === Language.TS,
      packageManager: packageManager as string,
      isMonorepoSubProject,
      isPublic,
    },
  );

  if (language === Language.TS) {
    const updateInfo: Record<string, string> = {
      'devDependencies.typescript': '^4',
      'devDependencies.@types/jest': '^26.0.9',
      'devDependencies.@types/node': '^14',
      'devDependencies.@types/react': '^17',
      'devDependencies.@types/react-dom': '^17',
    };

    await jsonAPI.update(
      context.materials.default.get(path.join(projectPath, 'package.json')),
      {
        query: {},
        update: { $set: updateInfo },
      },
    );

    await appApi.forgeTemplate(
      'templates/ts-template/**/*',
      undefined,
      resourceKey =>
        resourceKey
          .replace('templates/ts-template/', projectPath)
          .replace('.handlebars', ''),
    );
  }

  if (packageManager === PackageManager.Pnpm) {
    await appApi.forgeTemplate(
      'templates/pnpm-template/**/*',
      undefined,
      resourceKey =>
        resourceKey
          .replace('templates/pnpm-template/', projectPath)
          .replace('.handlebars', ''),
    );
  }

  if (enableLess === BooleanConfig.YES) {
    const lessDependence =
      ModuleActionFunctionsDependencies[ActionFunction.Less]!;
    await appApi.runSubGenerator(
      getGeneratorPath(DependenceGenerator, context.config.distTag),
      undefined,
      {
        dependencies: {
          [lessDependence]: await getPackageVersion(lessDependence),
        },
        isSubGenerator: true,
      },
    );
  }

  if (enableSass === BooleanConfig.YES) {
    const sassDependence =
      ModuleActionFunctionsDependencies[ActionFunction.Sass]!;
    await appApi.runSubGenerator(
      getGeneratorPath(DependenceGenerator, context.config.distTag),
      undefined,
      {
        dependencies: {
          [sassDependence]: await getPackageVersion(sassDependence),
        },
        isSubGenerator: true,
      },
    );
  }

  if (!isMonorepoSubProject) {
    await appApi.runSubGenerator(
      getGeneratorPath(ChangesetGenerator, context.config.distTag),
    );
  }

  if (isMonorepoSubProject && !isLocalPackages) {
    await appApi.updateWorkspace({
      name: packagePath as string,
      path: projectPath,
    });
  }

  return { projectPath };
};

// eslint-disable-next-line max-statements
export default async (context: GeneratorContext, generator: GeneratorCore) => {
  const appApi = new AppAPI(context, generator);

  const { locale, isSubGenerator } = context.config;
  i18n.changeLanguage({ locale });
  commonI18n.changeLanguage({ locale });
  utilsI18n.changeLanguage({ locale });
  appApi.i18n.changeLanguage({ locale });

  if (!(await appApi.checkEnvironment())) {
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }

  generator.logger.debug(`start run @modern-js/module-generator`);
  generator.logger.debug(`context=${JSON.stringify(context)}`);
  generator.logger.debug(`context.data=${JSON.stringify(context.data)}`);

  let projectPath = '';
  try {
    ({ projectPath } = await handleTemplateFile(context, generator, appApi));
  } catch (e) {
    generator.logger.error(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }

  if (isSubGenerator) {
    return;
  }

  if (context.handleForged) {
    await context.handleForged(
      Solution.Module,
      context,
      context.config.hasPlugin,
      projectPath,
    );
  }

  try {
    await appApi.runGitAndInstall(context.config.gitCommitMessage);
  } catch (e) {
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }

  appApi.showSuccessInfo(
    i18n.t(localeKeys.success, {
      packageManager: context.config.packageManager,
    }),
  );

  generator.logger.debug(`forge @modern-js/module-generator succeed `);
};
