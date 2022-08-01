import path from 'path';
import { fs } from '@modern-js/utils';

import { ProjectOption } from '../types';

export const generateOutputFile = (
  file: string,
  css: string,
  projectOptions: ProjectOption,
) => {
  const fileName = path.basename(file);
  if (fileName.startsWith('_')) {
    return;
  }
  const { stylesDir, outDir } = projectOptions;
  const ext = path.extname(fileName);
  const relativePath = path.relative(stylesDir, path.dirname(file));
  const outputPath = path.resolve(outDir, relativePath);
  const outputFile = path.join(outputPath, fileName.replace(ext, '.css'));

  fs.ensureFileSync(outputFile);
  fs.writeFileSync(outputFile, css);
};
