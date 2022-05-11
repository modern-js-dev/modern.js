import path from 'path';
import { GeneratorContext, GeneratorCore } from '@modern-js/codesmith';
import { AppAPI } from '@modern-js/codesmith-api-app';
import { JsonAPI } from '@modern-js/codesmith-api-json';
import { i18n } from '@modern-js/generator-common';
import { fs } from '@modern-js/generator-utils';

const handleTemplateFile = async (
  context: GeneratorContext,
  generator: GeneratorCore,
) => {
  const jsonAPI = new JsonAPI(generator);
  const { devDependencies, dependencies, peerDependencies, appendTypeContent } =
    context.config;

  const setJSON: Record<string, Record<string, string>> = {};
  Object.keys(devDependencies || {}).forEach(key => {
    setJSON[`devDependencies.${key}`] = devDependencies[key];
  });
  Object.keys(dependencies || {}).forEach(key => {
    setJSON[`dependencies.${key}`] = dependencies[key];
  });
  Object.keys(peerDependencies || {}).forEach(key => {
    setJSON[`peerDependencies.${key}`] = peerDependencies[key];
  });
  if (Object.keys(setJSON).length > 0) {
    await jsonAPI.update(context.materials.default.get(`package.json`), {
      query: {},
      update: { $set: setJSON },
    });
  }
  if (appendTypeContent) {
    const appDir = context.materials.default.basePath;
    const typePath = path.join(appDir, 'src', 'modern-app-env.d.ts');
    if (fs.existsSync(typePath)) {
      const npmrc = fs.readFileSync(typePath, 'utf-8');
      fs.writeFileSync(typePath, `${npmrc}${appendTypeContent}\n`, 'utf-8');
    } else {
      fs.ensureFileSync(typePath);
      fs.writeFileSync(typePath, appendTypeContent, 'utf-8');
    }
  }
};

export default async (context: GeneratorContext, generator: GeneratorCore) => {
  const appApi = new AppAPI(context, generator);

  const { locale } = context.config;
  i18n.changeLanguage({ locale });
  appApi.i18n.changeLanguage({ locale });

  if (!(await appApi.checkEnvironment())) {
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }

  generator.logger.debug(`start run @modern-js/dependence-generator`);
  generator.logger.debug(`context=${JSON.stringify(context)}`);
  generator.logger.debug(`context.data=${JSON.stringify(context.data)}`);

  await handleTemplateFile(context, generator);

  if (!context.config.isSubGenerator) {
    await appApi.runInstall();

    appApi.showSuccessInfo();
  }

  generator.logger.debug(`forge @modern-js/dependence-generator succeed `);
};
