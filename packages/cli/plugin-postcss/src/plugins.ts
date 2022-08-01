import path from 'path';
import postcssImport from 'postcss-import';
import { AcceptedPlugin } from 'postcss';

export const likeCssLoaderPostCssPlugins = (
  filePath: string,
  plugins: any[], // TODO: 这里postcss-import 类型文件版本比较旧，待最新更新后，可替换
) => {
  const ext = path.extname(filePath);
  return [
    // https://github.com/postcss/postcss-import
    postcssImport({
      resolve(id, basedir) {
        let importSpecifier = id.replace(`${basedir}/`, '');

        if (importSpecifier.includes(basedir)) {
          importSpecifier = id.replace(`${basedir}`, '');
        }

        const fileName = `${importSpecifier}${
          path.extname(importSpecifier) === '' ? ext : ''
        }`;

        const importFromNodeModule = importSpecifier.startsWith('~');

        if (importFromNodeModule) {
          let findPath = '';
          try {
            findPath = require.resolve(importSpecifier.slice(1), {
              paths: ['$HOME/.node_modules'],
            });
          } catch (e: any) {
            findPath = importSpecifier.slice(1);
            throw new Error(`${importSpecifier.slice(1)}: ${e.code}`);
          }

          return findPath;
        } else {
          return path.resolve(basedir, fileName);
        }
      },
      plugins,
    }),
  ] as AcceptedPlugin[];
};
