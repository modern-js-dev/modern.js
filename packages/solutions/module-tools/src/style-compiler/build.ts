import { CSS_EXTENSIONS, defaultCompilerOptions } from './constants';
import { resolveFiles } from './resolveFiles';
import { getFiles } from './utils';
import { IBuildOption } from './types';

export { CSS_EXTENSIONS };

export async function transformStyle(option: IBuildOption) {
  const {
    projectDir,
    stylesDir,
    outDir,
    enableVirtualDist = false,
    compilerOption = defaultCompilerOptions,
    compiler,
  } = option;
  // get style files
  const files = getFiles({
    stylesDir,
    extensions: CSS_EXTENSIONS,
  });

  if (enableVirtualDist) {
    return resolveFiles({
      files,
      projectDir,
      stylesDir,
      outDir,
      enableVirtualDist,
      options: compilerOption,
      compiler,
    });
  } else {
    await resolveFiles({
      files,
      projectDir,
      stylesDir,
      outDir,
      enableVirtualDist,
      options: compilerOption,
      compiler,
    });
    return undefined;
  }
}
