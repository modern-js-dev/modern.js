import path from 'path';
import { fs } from '@modern-js/utils';

export const template = (configPath: string) => `
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
const modernConfig = _interopRequireDefault(require('${configPath}')).default;

const theme =
    modernConfig && modernConfig.source && modernConfig.source.designSystem
      ? modernConfig.source.designSystem
      : {};
const tailwindcss =
    modernConfig && modernConfig.tools && modernConfig.tools.tailwindcss
      ? modernConfig.tools.tailwindcss
      : {};

module.exports = {
    theme,
    ...tailwindcss,
};
`;

export const checkTwinMacroNotExist = async (appDirectory: string) => {
  const depName = 'twin.macro';
  const packageJson =
    (await fs.readJSON(path.join(appDirectory, 'package.json'), {
      throws: false,
    })) || {};
  if (
    (typeof packageJson.dependencies === 'object' &&
      packageJson.dependencies[depName]) ||
    (typeof packageJson.devDependencies === 'object' &&
      packageJson.devDependencies[depName])
  ) {
    return false;
  }

  return true;
};
