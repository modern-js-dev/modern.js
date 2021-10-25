import { GeneratorContext, GeneratorCore } from '@modern-js/codesmith';
import { AppAPI } from '@modern-js/codesmith-api-app';
import {
  path,
  getPackageVersion,
  isTsProject,
  getPackageManager,
} from '@modern-js/generator-utils';
import {
  DependenceGenerator,
  i18n as commonI18n,
  Language,
} from '@modern-js/generator-common';
import { i18n, localeKeys } from './locale';

const getGeneratorPath = (generator: string, distTag: string) => {
  if (process.env.CODESMITH_ENV === 'development') {
    return path.dirname(require.resolve(generator));
  } else if (distTag) {
    return `${generator}@${distTag}`;
  }
  return generator;
};

const handleTemplateFile = async (
  context: GeneratorContext,
  appApi: AppAPI,
) => {
  const appDir = context.materials.default.basePath;
  const language = isTsProject(appDir) ? Language.TS : Language.JS;
  appApi.forgeTemplate('templates/base-template/**/*', undefined, resourceKey =>
    resourceKey
      .replace('templates/base-template/', '')
      .replace('.handlebars', `.${language}x`),
  );

  if (language === Language.TS) {
    appApi.forgeTemplate('templates/ts-template/**/*', undefined, resourceKey =>
      resourceKey
        .replace('templates/ts-template/', '')
        .replace('.handlebars', ``),
    );
  }

  const runtimeDependence = '@modern-js/runtime';

  await appApi.runSubGenerator(
    getGeneratorPath(DependenceGenerator, context.config.distTag),
    undefined,
    {
      ...context.config,
      devDependencies: {
        ...(context.config.devDependencies || {}),
        [runtimeDependence]: await getPackageVersion(runtimeDependence),
      },
      isSubGenerator: true,
    },
  );

  const packageManager = getPackageManager(appDir);

  return { packageManager };
};

export default async (context: GeneratorContext, generator: GeneratorCore) => {
  const appApi = new AppAPI(context, generator);

  const { locale } = context.config;
  commonI18n.changeLanguage({ locale });
  i18n.changeLanguage({ locale });
  appApi.i18n.changeLanguage({ locale });

  if (!(await appApi.checkEnvironment())) {
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }

  generator.logger.debug(`start run @modern-js/storybook-generator`);
  generator.logger.debug(`context=${JSON.stringify(context)}`);
  generator.logger.debug(`context.data=${JSON.stringify(context.data)}`);

  const { packageManager } = await handleTemplateFile(context, appApi);

  appApi.showSuccessInfo(i18n.t(localeKeys.success, { packageManager }));

  generator.logger.debug(`forge @modern-js/storybook-generator succeed `);
};
