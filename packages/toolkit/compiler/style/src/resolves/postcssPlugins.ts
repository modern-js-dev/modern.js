import { path } from '@modern-js/utils';
import postcssImport from 'postcss-import';
import { upath } from '@modern-js/utils';
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
        let importSpecifer = id.replace(`${basedir}/`, '');

        if (importSpecifer.includes(basedir)) {
          importSpecifer = id.replace(`${basedir}`, '');
        }

        const fileName = `${importSpecifer}${
          path.extname(importSpecifer) === '' ? ext : ''
        }`;

        const importFromNodeModule = importSpecifer.startsWith('~');

        if (importFromNodeModule) {
          let findPath = '';
          try {
            findPath = upath.normalizeSafe(require.resolve(importSpecifer.slice(1), {
              paths: ['$HOME/.node_modules'],
            }));
          } catch (e: any) {
            findPath = importSpecifer.slice(1);
            throw new Error(`${importSpecifer.slice(1)}: ${e.code}`);
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
