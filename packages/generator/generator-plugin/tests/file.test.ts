import path from 'path';
import {
  CodeSmith,
  GeneratorCore,
  MaterialsManager,
} from '@modern-js/codesmith';
import { fs } from '@modern-js/generator-utils';
import { PluginFileAPI } from '../src/context/file';

describe('test file api', () => {
  const smith = new CodeSmith({});
  const projectDir = path.join(__dirname, 'fixtures', 'file-test');
  const mockGeneratorCore = new GeneratorCore({
    logger: smith.logger,
    materialsManager: new MaterialsManager(),
    outputPath: projectDir,
  });
  test('update json file', async () => {
    const pluginFileApi = new PluginFileAPI();
    pluginFileApi.prepare(
      mockGeneratorCore,
      path.resolve(__dirname, 'fixtures', 'file-test'),
      path.resolve(__dirname, 'fixtures', 'file-test', 'templates'),
    );
    await pluginFileApi.updateJSONFile('package.json', {
      browserslist: ['> 0.01%', 'not dead', 'not op_mini all'],
      'devDependencies.@modern-js/plugin-tailwind': '^1.0.0', // todo change version
    });
    const content = fs.readJSONSync(
      path.resolve(__dirname, 'fixtures', 'file-test', 'package.json'),
    );
    expect(content.browserslist).toEqual([
      '> 0.01%',
      'not dead',
      'not op_mini all',
    ]);
    expect(content.devDependencies).toEqual({
      '@modern-js/plugin-tailwind': '^1.0.0',
    });
  });
  test('update modern config', async () => {
    const pluginFileApi = new PluginFileAPI();
    pluginFileApi.prepare(
      mockGeneratorCore,
      path.resolve(__dirname, 'fixtures', 'file-test'),
      path.resolve(__dirname, 'fixtures', 'file-test', 'templates'),
    );
    await pluginFileApi.updateModernConfig({
      runtime: {
        state: true,
        router: true,
      },
    });
    const content = fs.readJSONSync(
      path.resolve(__dirname, 'fixtures', 'file-test', 'package.json'),
    );
    expect(content.modernConfig).toEqual({
      runtime: {
        state: true,
        router: true,
      },
    });
  });
});
