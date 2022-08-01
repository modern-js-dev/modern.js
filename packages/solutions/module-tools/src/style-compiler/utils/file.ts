import path from 'path';
import { glob } from '@modern-js/utils';

// get style file's real path
const getRealFiles = (files: string[] = [], stylesDir = process.cwd()) =>
  files.map(file => path.join(stylesDir, file));

// get all extension glob string
const getExtString = (extensions: string[]) => `{${extensions.join(',')}}`;

// delete same file
const filterRepeatFile = (files: string[] = []) => Array.from(new Set(files));

const getIncludeFiles = (
  include = ['./'],
  stylesDir = process.cwd(),
  extensions = ['.css'],
) => {
  const ret = [];
  const exts = getExtString(extensions);
  for (let start = 0, len = include.length; start < len; start++) {
    const includePath = path.join(stylesDir, include[start]);
    ret.push(...glob.sync(`${includePath}/**/*${exts}`));
  }

  return filterRepeatFile(ret);
};

interface FileOption {
  files?: string[];
  include?: string[];
  stylesDir?: string;
  extensions?: string[];
}

export const getFiles = (options: FileOption) => {
  const {
    files = [],
    include = ['./'],
    stylesDir = process.cwd(),
    extensions = ['.css'],
  } = options;

  return [
    ...getRealFiles(files, stylesDir),
    ...getIncludeFiles(include, stylesDir, extensions),
  ];
};
